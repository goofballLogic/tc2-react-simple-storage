const LIST_FACTORY = Symbol();

class BrowseList {

    constructor( list, listFactory, current, back ) {

        this.list = list || [];
        this[ LIST_FACTORY ] = listFactory;
        this.current = current || { id: 0 };
        if ( back ) this.back = () => back;

    }

    go( item ) {

        const [ newList, newListFactory ] = this[ LIST_FACTORY ]( item );
        return new BrowseList( newList, newListFactory, item, this );

    }

    path() {

        return this.back ? [ ...this.back().path(), this.current.name ] : [ this.current.name ];

    }

    pathIds() {

        return this.back ? [ ...this.back().pathIds(), this.current.id ] : [ this.current.id ];

    }

    walk( path ) {

        if ( !( path && path.length ) ) { return [ this ]; }
        const fromId = path.shift();
        if ( fromId !== this.current.id ) return [];
        const toId = path[ 0 ];
        const to = this.list.find( x => x.id === toId );
        if ( !to ) return [ this ];
        const nextSteps = this.go( to ).walk( path );
        return [ this, ...nextSteps ];

    }

}

export default BrowseList;
