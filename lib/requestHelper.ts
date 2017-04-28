import * as request from "request"
import { data } from "./../test/utils/index";

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


/**
 * POST Request promise
 * @param uri 
 * @param data JSON
 */
export function _PostRequest (uri: string, data){
    return new Promise((resolve, reject) => {
        var body = "";
        console.log (JSON.stringify(data));
        var post = request.post(uri, {
            headers: {
                "content-type": "application/json"
            },
            method: "POST",
            json: true,
            body: data
        })
        .on("data", function (chunck){
            console.log(chunck)
            body += chunck;
            //process.stdout.write(chunck);
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
        
    })
}

/**
 * PUT Request promise
 * @param uri 
 * @param data JSON
 */
export function _PutRequest (uri: string, data){
    return new Promise((resolve, reject) => {
        var body = "";
        console.log(JSON.stringify(data));
        var put = request.put(uri, {
            headers: {
                "content-type": "application/json"
            },
            method: "POST",
            json: true,
            body: data
        })
        .on("data", function(chunk){
            console.log(chunk);
            body += chunk;
        })
        .on('end', function(response){
            let jsonObject = JSON.parse(body);
            console.log(jsonObject);
            resolve(jsonObject);
        }).on("error", function(err){
            console.log(err);
            reject(err);
        })
    })
}