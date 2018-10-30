/*!
 * Video Length, http://tpkn.me/
 */

let util = require('util');
let exec = util.promisify(require('child_process').exec);

async function videoLength(file, options = {}){
   let bin = 'ffprobe';
   let len = 0;

   if(typeof options.bin === 'string'){
      bin = options.bin;
   }

   try {
      let data = await exec(`${bin} -i "${file}" -show_entries format=duration -v quiet -of csv="p=0"`);
      if(typeof data.stdout !== 'undefined'){
         data = data.stdout;
      }
      len = parseFloat(data);
   }catch(err){
      if(typeof options.debug !== 'undefined' && options.debug){
         console.log(err);
      }
   }

   return len;
}

module.exports = videoLength;
