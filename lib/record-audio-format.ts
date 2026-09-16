export const MIN_AUDIO_BYTES = 64;

export function looksLikeAudioContainer(bytes: Uint8Array) {
  if (bytes.length >= 4 && bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) {
    return true;
  }
  if (bytes.length >= 8) {
    const box = String.fromCharCode(bytes[4], bytes[5], bytes[6], bytes[7]);
    if (box === 'ftyp') return true;
  }
  if (bytes.length >= 4) {
    const head = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
    if (head === 'OggS' || head === 'RIFF' || head === 'ID3') return true;
  }
  return false;
}

export function filenameForAudioType(contentType: string) {
  if (contentType.includes('mp4') || contentType.includes('aac') || contentType.includes('m4a')) {
    return 'recording.m4a';
  }
  return 'recording.webm';
}
