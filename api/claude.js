import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, topic, imageData, systemPrompt } = req.body;

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not configured');
    return res.status(500).json({ error: 'API key not configured' });
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  if (!systemPrompt) {
    return res.status(400).json({ error: 'System prompt is required' });
  }

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Choose model - Haiku is most widely available
    // Set ANTHROPIC_MODEL env var in Vercel to use a different model your account has access to
    // Common models: claude-3-haiku-20240307, claude-3-5-sonnet-20241022, claude-3-opus-20240229
    const modelName = process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307';

    // Build content array
    const content = [];
    
    // Add image if provided
    if (imageData) {
      const base64Data = imageData.split(',')[1];
      const mediaType = imageData.split(';')[0].split(':')[1];
      
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: mediaType,
          data: base64Data,
        },
      });
    }

    // Add the latest user message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      content.push({
        type: 'text',
        text: lastMessage.content,
      });
    }

    // Build conversation history
    const conversationMessages = messages.slice(0, -1).map((msg) => ({
      role: (msg.role === 'dad' || msg.role === 'strategist') ? 'assistant' : 'user',
      content: msg.content,
    }));

    // Add current message with image
    conversationMessages.push({
      role: 'user',
      content,
    });

    const response = await anthropic.messages.create({
      model: modelName,
      max_tokens: 300, // Keep responses short and conversational
      system: systemPrompt,
      messages: conversationMessages,
    });

    const textContent = response.content.find((c) => c.type === 'text');
    const messageText = textContent?.text || '';

    // Parse response indicators (support both old and new markers)
    const needsProfessional = /PRO_RECOMMENDED/i.test(messageText);
    const needsDeepWork = /CLARITY_SPRINT_RECOMMENDED/i.test(messageText);
    const frameworkMatch = messageText.match(/FRAMEWORK:\s*(.+?)(?:\n|$)/i);
    const videoMatch = messageText.match(/VIDEO_HELPFUL:\s*(.+?)(?:\n|$)/i);
    const moodMatch = messageText.match(/MOOD:\s*(\w+)/i);

    // Clean message text - remove all marker strings anywhere in the text
    const cleanedMessage = messageText
      .replace(/\bDIY_OK\b\s*[?:.]?\s*/gi, '')
      .replace(/\bPRO_RECOMMENDED\b\s*[?:.]?\s*/gi, '')
      .replace(/\bCLARITY_SPRINT_RECOMMENDED\b\s*[?:.]?\s*/gi, '')
      .replace(/FRAMEWORK:\s*[^\n]*/gi, '')
      .replace(/VIDEO_HELPFUL:\s*[^\n]*/gi, '')
      .replace(/MOOD:\s*[^\n]*/gi, '')
      .replace(/\(\s*\)/g, '') // Remove empty parentheses with or without spaces
      .replace(/\s*\(\s*/g, ' (') // Normalize spacing before opening paren
      .replace(/\s*\)\s*/g, ') ') // Normalize spacing after closing paren
      .replace(/\s+\)/g, ')') // Remove space before closing paren
      .replace(/\(\s+/g, '(') // Remove space after opening paren
      .replace(/\(\)/g, '') // Remove any remaining empty parentheses
      .replace(/(?<!\w)\((?!\w)/g, '') // Remove stray opening parenthesis
      .replace(/(?<!\w)\)(?!\w)/g, '') // Remove stray closing parenthesis
      .trim()
      .replace(/\s+/g, ' '); // Clean up extra spaces

    // Remove action markers (like *pats your shoulders*) from audio text
    // Keep them in the displayed message but remove from TTS
    const audioText = cleanedMessage
      .replace(/\*[^*]+\*/g, '') // Remove *action* markers
      .replace(/\_[^_]+\_/g, '') // Remove _action_ markers
      .replace(/\[[^\]]+\]/g, '') // Remove [action] markers
      .replace(/\([^)]*\)/g, '') // Remove all parentheses and their content for TTS
      .replace(/\s+/g, ' ') // Clean up extra spaces
      .trim();

    // Extract professional/escalation type
    let professionalType;
    let escalationType;
    
    if (needsProfessional) {
      if (/electrician/i.test(messageText)) professionalType = 'electrician';
      else if (/plumber/i.test(messageText)) professionalType = 'plumber';
      else if (/mechanic/i.test(messageText)) professionalType = 'mechanic';
      else if (/therapist|counselor/i.test(messageText)) professionalType = 'therapist';
      else if (/lawyer|attorney/i.test(messageText)) professionalType = 'lawyer';
    }
    
    if (needsDeepWork) {
      escalationType = 'clarity_sprint';
    }

    res.status(200).json({
      message: cleanedMessage,
      audioText: audioText,
      // Support both old and new response formats
      needsProfessional: needsProfessional || needsDeepWork,
      needsDeepWork: needsDeepWork,
      professionalType,
      escalationType,
      frameworkSuggested: frameworkMatch ? frameworkMatch[1].trim() : undefined,
      safetyLevel: needsProfessional ? 'professional_required' : 'safe_diy',
      videoSuggestion: videoMatch ? videoMatch[1].trim() : undefined,
      mood: moodMatch ? moodMatch[1].toLowerCase() : 'idle',
    });
  } catch (error) {
    console.error('Claude API error:', error);
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);
    console.error('Error status:', error.status);
    console.error('Error statusCode:', error.statusCode);
    if (error?.response) {
      try {
        const body = await error.response.text();
        console.error('Error response body:', body);
      } catch (e) {
        console.error('Could not read error response body');
      }
    }
    
    // Anthropic SDK errors have different structure
    let errorDetails = error.message || 'Unknown error';
    let statusCode = 500;
    
    if (error.status) {
      statusCode = error.status;
    } else if (error.statusCode) {
      statusCode = error.statusCode;
    }
    
    // If it's a 404, the model might be wrong
    if (statusCode === 404) {
      errorDetails = 'Model not found. Try setting ANTHROPIC_MODEL env to a model your account can access, e.g. claude-3-5-sonnet-20241022 or claude-3-haiku-20240307.';
    }
    
    res.status(statusCode < 500 ? statusCode : 500).json({ 
      error: 'Failed to get response from Strategist',
      details: errorDetails,
    });
  }
}

