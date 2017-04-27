import * as request from "request"

/**
 * GET Request Promise
 * @param uri 
 */
export function _GetRequest(uri: string){
    
    return new Promise((resolve, reject) => {

        var body = "";
        
        request.get(uri)
        .on("data", function (chunck){
            console.log(chunck)
            body += chunck;
        })
        .on('end', function(response){
            let jsonObject = JSON.parse(body);
            //console.log(body);
            console.log (jsonObject);
            resolve(jsonObject);
        }).on("error", function(err){
            console.log(err);
            reject(err);
        })
    });
}