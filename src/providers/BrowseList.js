class BrowseList {

    constructor( list, listFactory, current, back ) {

        this.list = list;
        this.go = item => {

            const [ newList, newListFactory ] = listFactory( item );
            return new BrowseList( newList, newListFactory, item, this );

        };
        this.current = current || { id: 0 };
        if ( back ) this.back = () => back;

    }

}

export default BrowseList;
