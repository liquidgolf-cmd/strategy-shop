import { TextToSpeechClient } from '@google-cloud/text-to-speech';

// Initialize TTS client with service account credentials
let ttsClient = null;

function getTTSClient() {
  if (!ttsClient) {
    const credentialsJson = process.env.GOOGLE_TTS_CREDENTIALS;
    
    if (!credentialsJson) {
      throw new Error('GOOGLE_TTS_CREDENTIALS environment variable is not set. Please provide service account JSON.');
    }

    try {
      const credentials = JSON.parse(credentialsJson);
      ttsClient = new TextToSpeechClient({
        credentials: credentials,
        projectId: credentials.project_id,
      });
    } catch (error) {
      console.error('Error parsing GOOGLE_TTS_CREDENTIALS:', error);
      throw new Error(`GOOGLE_TTS_CREDENTIALS must be valid JSON: ${error.message}`);
    }
  }
  return ttsClient;
}

// Google Cloud TTS API handler
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const client = getTTSClient();
    
    // Check if text is SSML (starts with <speak>)
    const isSSML = text.trim().startsWith('<speak>');
    const input = isSSML ? { ssml: text } : { text };
    
    const request = {
      input,
      voice: {
        languageCode: 'en-US',
        name: 'en-US-Neural2-D', // Reliable, natural male voice
        ssmlGender: 'MALE',
      },
      audioConfig: {
        audioEncoding: 'MP3',
        pitch: 0.2, // Slightly warmer
        speakingRate: 0.95, // Slightly slower for clarity
      },
    };

    const [response] = await client.synthesizeSpeech(request);

    if (!response.audioContent) {
      throw new Error('No audio content received');
    }

    // Convert Uint8Array to base64
    const audioContentBase64 = Buffer.from(response.audioContent).toString('base64');
    const audioUrl = `data:audio/mp3;base64,${audioContentBase64}`;

    res.status(200).json({ audioUrl });
  } catch (error) {
    console.error('TTS API error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to generate speech',
      details: error.message || 'Unknown error',
    });
  }
}
