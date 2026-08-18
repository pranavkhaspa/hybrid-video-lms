import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs-extra';
import path from 'path';


/**
 * Validate and normalize an audio file before it enters the
 * talking-head rendering pipeline.
 *
 * Normalized output:
 * - MP3
 * - 44100 Hz
 * - Mono
 * - 192k bitrate
 */
export async function validateAndNormalizeAudio(inputPath, outputPath) {
  if (!inputPath) {
    throw new Error('Audio input path is required.');
  }

  if (!outputPath) {
    throw new Error('Audio output path is required.');
  }

  if (!fs.existsSync(inputPath)) {
    throw new Error(`Audio file not found: ${inputPath}`);
  }

  const fileStats = await fs.stat(inputPath);

  if (!fileStats.isFile() || fileStats.size === 0) {
    throw new Error('Audio file is empty or invalid.');
  }

  const metadata = await new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, data) => {
      if (err) {
        return reject(
          new Error(`Invalid or corrupted audio file: ${err.message}`)
        );
      }

      resolve(data);
    });
  });

  const audioStream = metadata?.streams?.find(
    (stream) => stream.codec_type === 'audio'
  );

  if (!audioStream) {
    throw new Error('Input file does not contain a valid audio stream.');
  }

  const duration = Number(metadata?.format?.duration || 0);

  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error('Audio duration is invalid or zero.');
  }

  const formatName = metadata?.format?.format_name || 'unknown';

  console.log(`[FFmpeg] Input Audio Format: ${formatName}`);
  console.log(`[FFmpeg] Input Audio Duration: ${duration.toFixed(2)}s`);
  console.log(`[FFmpeg] Input Sample Rate: ${audioStream.sample_rate || 'unknown'}`);
  console.log(`[FFmpeg] Input Channels: ${audioStream.channels || 'unknown'}`);

  await fs.ensureDir(path.dirname(outputPath));

  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioCodec('libmp3lame')
      .audioFrequency(44100)
      .audioChannels(1)
      .audioBitrate('192k')
      .output(outputPath)
      .on('end', resolve)
      .on('error', (err) => {
        reject(new Error(`Audio normalization failed: ${err.message}`));
      })
      .run();
  });

  if (!fs.existsSync(outputPath)) {
    throw new Error('Audio normalization completed but output file was not created.');
  }

  const normalizedStats = await fs.stat(outputPath);

  if (normalizedStats.size === 0) {
    throw new Error('Normalized audio output is empty.');
  }

  // Validate the normalized output again.
  const normalizedMetadata = await new Promise((resolve, reject) => {
    ffmpeg.ffprobe(outputPath, (err, data) => {
      if (err) {
        return reject(
          new Error(`Normalized audio validation failed: ${err.message}`)
        );
      }

      resolve(data);
    });
  });

  const normalizedAudioStream = normalizedMetadata?.streams?.find(
    (stream) => stream.codec_type === 'audio'
  );

  const normalizedDuration = Number(
    normalizedMetadata?.format?.duration || 0
  );

  if (!normalizedAudioStream || normalizedDuration <= 0) {
    throw new Error('Normalized audio output is invalid.');
  }

  console.log(
    `[FFmpeg] Audio normalized successfully: ${outputPath}`
  );
  console.log(
    `[FFmpeg] Normalized Duration: ${normalizedDuration.toFixed(2)}s`
  );
  console.log(
    `[FFmpeg] Normalized Sample Rate: ${normalizedAudioStream.sample_rate || 'unknown'}`
  );
  console.log(
    `[FFmpeg] Normalized Channels: ${normalizedAudioStream.channels || 'unknown'}`
  );

  return {
    success: true,
    inputPath,
    outputPath,
    format: normalizedMetadata?.format?.format_name || 'mp3',
    duration: normalizedDuration,
    sampleRate: Number(normalizedAudioStream.sample_rate || 0),
    channels: Number(normalizedAudioStream.channels || 0)
  };
}


/**
 * Get Audio Duration in seconds
 */
export function getAudioDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      const duration = metadata?.format?.duration || 0;
      resolve(duration);
    });
  });
}

/**
 * Split Audio File into ~chunkDurationSec segments
 */
export function splitAudioIntoChunks(audioPath, outputDir, chunkDurationSec = 20) {
  return new Promise(async (resolve, reject) => {
    if (!audioPath) {
      return reject(new Error("Audio path is required."));
    }
    if (!outputDir) {
      return reject(new Error("Output directory is required."));
    }

    if (!fs.existsSync(audioPath)) {
      return reject(new Error(`Audio file not found: ${audioPath}`));
    }

    if (chunkDurationSec <= 0) {
      return reject(new Error("Chunk duration must be greater than zero."));
    }
    try {
      const totalDuration = await getAudioDuration(audioPath);
      const numChunks = Math.ceil(totalDuration / chunkDurationSec);
      console.log(`[FFmpeg] Audio Duration: ${totalDuration.toFixed(2)}s`);
      console.log(`[FFmpeg] Chunk Duration: ${chunkDurationSec}s`);
      console.log(`[FFmpeg] Number of Chunks: ${numChunks}`);
      const chunkPaths = [];

      await fs.ensureDir(outputDir);

      let completed = 0;
      if (numChunks <= 1) {
        // Return single audio file
        console.log('[FFmpeg] Audio is short enough. No chunking required.');
        return resolve([audioPath]);
      }

      for (let i = 0; i < numChunks; i++) {
        const startTime = i * chunkDurationSec;
        const chunkPath = path.join(outputDir, `chunk_${i}.mp3`);
        const audioFilter = process.env.AUDIO_FILTER || 'loudnorm';
        const audioBitrate = process.env.AUDIO_BITRATE || '192k';
        const sampleRate = Number(process.env.AUDIO_SAMPLE_RATE || 44100);

        console.log(`[FFmpeg] Creating chunk ${i + 1}/${numChunks}`);
        console.log(`[FFmpeg] Audio Filter: ${audioFilter}`);
        console.log(`[FFmpeg] Audio Bitrate: ${audioBitrate}`);
        console.log(`[FFmpeg] Sample Rate: ${sampleRate}`);
        
        chunkPaths.push(chunkPath);

        ffmpeg(audioPath)
          .setStartTime(startTime)
          .setDuration(chunkDurationSec)
          .audioFilters(audioFilter)
          .audioBitrate(audioBitrate)
          .audioFrequency(sampleRate)
          .output(chunkPath)
          .on('end', () => {
            console.log(`[FFmpeg] Finished chunk ${i + 1}/${numChunks}`);
            completed++;
            if (completed === numChunks) {
              console.log(
                `[FFmpeg] Successfully generated ${chunkPaths.length} audio chunk(s).`
              );
              resolve(chunkPaths);
            }
          })
          .on('error', (err) => reject(err))
          .run();
      }
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Concatenate multiple video files into a single final MP4 and merge original master audio
 */
export function concatenateVideos(videoPaths, masterAudioPath, outputPath) {
  return new Promise((resolve, reject) => {
    if (!videoPaths || videoPaths.length === 0) {
      return reject(new Error('No video paths provided for concatenation'));
    }

    if (videoPaths.length === 1) {
      // Just overlay master audio if single clip
      ffmpeg(videoPaths[0])
        .input(masterAudioPath)
        .outputOptions(['-c:v copy', '-c:a aac', '-map 0:v:0', '-map 1:a:0', '-shortest'])
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
      return;
    }

    // Write file list for FFmpeg concat filter
    const listFilePath = path.join(path.dirname(outputPath), 'concat_list.txt');
    const fileContent = videoPaths.map(p => `file '${path.resolve(p).replace(/'/g, "'\\\\''")}'`).join('\n');
    fs.writeFileSync(listFilePath, fileContent);

    const tempConcatVideo = path.join(path.dirname(outputPath), 'temp_concat.mp4');

    ffmpeg()
      .input(listFilePath)
      .inputOptions(['-f concat', '-safe 0'])
      .outputOptions(['-c copy'])
      .output(tempConcatVideo)
      .on('end', () => {
        // Merge master audio onto concatenated video
        ffmpeg(tempConcatVideo)
          .input(masterAudioPath)
          .outputOptions(['-c:v copy', '-c:a aac', '-map 0:v:0', '-map 1:a:0', '-shortest'])
          .output(outputPath)
          .on('end', () => {
            fs.removeSync(listFilePath);
            fs.removeSync(tempConcatVideo);
            resolve(outputPath);
          })
          .on('error', (err) => reject(err))
          .run();
      })
      .on('error', (err) => reject(err))
      .run();
  });
}


