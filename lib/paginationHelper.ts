import * as querystring from 'querystring'

export function getTotalPages (count: number, perPage){
    var total: number = count / perPage;
    return Math.ceil(total);
}

export function getQueryString (req): any{
    var str = req.url.split('?')[1];
    var qs = querystring.parse(str);
    return qs;
}

export function createPaginationOptions(page: number, perPage: number, pages: number, path: string){
    return {
        page: page,
        perPage: perPage,
        pages: pages,
        path: path
    };

}

/**
 * Helper function to build the parameter options of the pagination on UI
 * @param req Request
 * @param elementCount Expected total amount of elements in Query 
 * @param slug Slugified String
 */
export function paginate(req, elementCount: number, path: string){
    var qs = getQueryString(req);
    var perPage = qs.perPage || 6;
    var page = qs.page || 1;
    var pages = getTotalPages(elementCount, perPage);


    return createPaginationOptions(page, perPage, pages, path);

}