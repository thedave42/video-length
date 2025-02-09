/*!
 * Video Length, http://tpkn.me/
 */
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);

async function VideoLength(file, options = {}){
   let result;
   let { bin = 'MediaInfo', extended = false, giveall = false } = options;

   let { stdout } = await execFile(bin, [ '--full', '--output=JSON', file ]);
   if(stdout){

      let specs = JSON.parse(stdout);
      let { track } = specs.media;
      if(!track){
         throw new TypeError('Can\'t extract video specs');
      }

      // General info
      let general_specs = track.find(i => i['@type'] == 'General');
      if(!general_specs){
         throw new TypeError('Can\'t find "General" specs');
      }

      // Video track specs
      let video_specs = track.find(i => i['@type'] == 'Video');
      if(!video_specs){
         throw new TypeError('Can\'t find "Video" track');
      }
      
      let audio_specs = track.find(i => i['@type'] == 'Audio');
      if (!audio_specs) {
         throw new TypeError('Can\'t find "Audio" track');
      }

      let { Duration, FrameRate, OverallBitRate, FileSize } = general_specs;
      let { Width, Height } = video_specs;
      let { StreamCount } = audio_specs;
      
      if(extended){
         result = {
            duration       : parseFloat(Duration),
            width          : parseFloat(Width),
            height         : parseFloat(Height),
            fps            : parseFloat(FrameRate),
            bitrate        : parseFloat(OverallBitRate),
            size           : parseFloat(FileSize),
            audio_tracks   : parseFloat(StreamCount),
         }
      }else if(giveall){
         result = specs;
      }else{
         result = parseFloat(Duration);
      }
      
   }

   return result
}

module.exports = VideoLength;
