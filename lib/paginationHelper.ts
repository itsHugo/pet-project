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

export function createPaginationOptions(page: number, perPage: number, pages: number, path: string, nextpage: number, prevpage: number){
    return {
        page: page,
        perPage: perPage,
        pages: pages,
        path: path,
        nextpage: nextpage,
        prevpage: prevpage
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
    var perPage = qs.perPage as number || 6;
    var page = qs.page as number || 1;
    var pages = getTotalPages(elementCount, perPage);


    //DUNNO why pages + 1 turns into a concatinated string
    var nextpage = page;
    if(page < pages)
        nextpage++;

    var prevpage = (page > 1)?(page - 1): 1;

    console.log(nextpage);



    return createPaginationOptions(page, perPage, pages, path, nextpage, prevpage);

}