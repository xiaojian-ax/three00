import https from '../../https'
import {devPath,devPath1} from './path'
export const drawApi = {
    add:data =>https.fetchPost(devPath1+'/hello2/test',data).then(res => res.data)
  
}