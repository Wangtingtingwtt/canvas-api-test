class Astar
{
        public _startx:number;
        public _starty:number;
        public _endx:number;
        public _endy:number;
        private _grid:Grid;
        public _path:MapNode[]=[];
        private _openArray:MapNode[]=[];
        private _closeArray:MapNode[]=[];
        private _straightCost:number=1.0;
        private _diagCost:number = 1.4;

        public constructor(grid:Grid){
            this._grid=grid;
        }
        public setEndNode(xpos: number, ypos: number) {
            this._endx = xpos;
            this._endy = ypos;
        }
        public setStartNode(xpos: number, ypos: number) {
            this._startx = xpos;
            this._starty = ypos;
            // console.log("起点x:"+xpos+"y:"+ypos)
        }

        private manhattan(node:MapNode):number{
            return Math.abs(node.x - this._endx) * this._straightCost + Math.abs(node.y + this._endy) * this._straightCost;
        }
 
//几何估价法
        private euclidian(node:MapNode):number{
            var dx:number=node.x - this._endx;
            var dy:number=node.y - this._endy;
            return Math.sqrt(dx * dx + dy * dy) * this._straightCost;
        }
 
//对角线估价法
        private diagonal(node:MapNode):number{
            var dx:number=Math.abs(node.x - this._endx);
            var dy:number=Math.abs(node.y - this._endy);
            var diag:number=Math.min(dx, dy);
            var straight:number=dx + dy;
            return this._diagCost * diag + this._straightCost * (straight - 2 * diag);
        }

       /* public find(){
            var mm=new MapNode(this._startx,this._starty);
            // this._grid.OuttoConsole();
            // console.log(mm.x+"0.123"+mm.y);
            console.log("起点x:"+this._startx+"y:"+this._starty)
            console.log("终点x:"+this._endx+"y:"+this._endy)
            this.findPath(mm);
        }*/
        public findPath():number
        {
            var m=new MapNode(this._startx,this._starty);     // 起始点加入open表  
            m.g = 0;  
            m.h = this.manhattan(m);  
            m.parent = null;  
            this._openArray.push(m); 
         //    console.log(m.x+"0.123"+m.y);       
            if ( m.x == this._endx && m.y == this._endy )  
            {  
                console.log("起点==终点！\n"); 
                //return 0; 
            }  
      
            var is_found = false;  
  
        while( true )  
        {  
            if(this._openArray.length>0)
            this.adjust_heap();                              // 调整开放列表  
            var curr_node:MapNode = this._openArray[0];      // open表的第一个点一定是f值最小的点(通过堆排序得到的)  
            this._openArray.shift();

            this._closeArray[this._closeArray.length++] = curr_node;    // 当前点加入close表  
            //console.log("寻路x:"+curr_node.x+"          y:"+curr_node.y);    
            if ( curr_node.x == this._endx && curr_node.y == this._endy )// 终点在close中，结束  
            {  
                is_found = true;  
                break;  
            }  

            this.get_neighbors( curr_node );           // 对邻居的处理  
            if ( this._openArray.length == 0 )             // 没有路径到达  
            {  
                is_found = false;  
                break;  
            }
            if(this._openArray.length>0)
                this.adjust_heap();    
        }  
        var top = -1; 
        if ( is_found )  
        {  
            curr_node.x = this._endx;
            curr_node.y = this._endy;  
            
            while( curr_node )  
            {  
                this._path[++top] = curr_node;  
                curr_node = curr_node.parent;  
            }  
    
            // while( top >= 0 )        // 下面是输出路径看看~  
            // {  
            //     if ( top > 0 )  
            //     {  
            //         console.log("(%d,%d)-->", this._path[top].x, this._path[top--].y);  
            //     }  
            //     else  
            //     {  
            //         console.log("(%d,%d)",this._path[top].x, this._path[top--].y);  
            //     }  

            // }  
            return 1;
        }  
        else  
        {  
             console.log("没有找到路径");  
             return -1;
        }  
           
    }  
    public empty(){
        var n=this._closeArray.length;
        for(var i=0;i<n;i++)
            this._closeArray.shift();
        var n=this._openArray.length;
        for(var i=0;i<n;i++)
            this._openArray.shift();
        var n=this._path.length;
        for(var i=0;i<n;i++)
            this._path.shift();
    }
        
    private Has_closeArray(M:MapNode):boolean{
        for(var i=0;i<=this._closeArray.length;i++){
            if(this._closeArray[i]==M)
                return true;
        }
        return false;
    }
    
    private Has_openArray(M:MapNode):boolean{
        for(var i=0;i<=this._openArray.length;i++){
            if(this._openArray[i]==M)
                return true;
        }
        return false;
    }
private swap(idx1:number,idx2:number)    
{    
    var tmp:MapNode =this._openArray[idx1];  
    this._openArray[idx1] = this._openArray[idx2];  
    this._openArray[idx2] = tmp;  
}  
    // 堆调整  
//   
private adjust_heap( )      
{     
   var n=0;
   for(var i=0;i<this._openArray.length;i++){
       if((this._openArray[n].g+this._openArray[n].h)>(this._openArray[i].g+this._openArray[i].h)){
           n=i;
       }
   }
   this.swap(n,0);
}    
// 判断邻居点是否可以进入open表  
//   
private insert_to_opentable( x:number,y:number, curr_node:MapNode,w:number )  
{  
    var i:number;

    if ( this._grid._Grid[x][y].WalkAble != false )        // 不是障碍物  
    {  
        if ( !this.Has_closeArray(this._grid._Grid[x][y]) )   // 不在闭表中  
        {  
            // if (this.Has_openArray(this._grid._Grid[x][y])) // 在open表中  
            // {
            //     // 需要判断是否是一条更优化的路径  
            //     //   
            //     if (this._grid._Grid[x][y].g > curr_node.g + w)    // 如果更优化  
            //     {
            //         this._grid._Grid[x][y].g = curr_node.g + w;
            //         this._grid._Grid[x][y].parent = curr_node;

            //         for (i = 0; i < this._openArray.length; ++i) {
            //             if (this._openArray[i].x == this._grid._Grid[x][y].x && this._openArray[i].y == this._grid._Grid[x][y].y) {
            //                 break;
            //             }
            //         }
            //         if (this._openArray.length > 0)
            //             this.adjust_heap();                   // 下面调整点  
            //     }
            // }
            // else       
            if(!this.Has_openArray(this._grid._Grid[x][y]))                             // 不在open中  
            {  
                this._grid._Grid[x][y].g = curr_node.g + w;  
                this._grid._Grid[x][y].h = this.manhattan(this._grid._Grid[x][y]);  
                this._grid._Grid[x][y].parent = curr_node;  
                this._openArray.push(this._grid._Grid[x][y]); 
            }  
        }  
    }  
}  
    // 查找邻居  
    // 对上下左右8个邻居进行查找  
    //    
    private  get_neighbors( curr_node:MapNode)  
    {  
        var x = curr_node.x;  
        var y = curr_node.y;  
    
        // 下面对于8个邻居进行处理！  
        //   
        if ( ( x + 1 ) >= 0 && ( x + 1 ) < 10 && y >= 0 && y < 10 )  
        {  
            this.insert_to_opentable( x+1, y, curr_node, 10 );  
        }  
    
        if ( ( x - 1 ) >= 0 && ( x - 1 ) < 10 && y >= 0 && y < 10 )  
        {  
            this.insert_to_opentable( x-1, y, curr_node, 10 );  
        }  
    
        if ( x >= 0 && x < 10 && ( y + 1 ) >= 0 && ( y + 1 ) < 10 )  
        {  
            this.insert_to_opentable( x, y+1, curr_node, 10 );  
        }  
    
        if ( x >= 0 && x < 10 && ( y - 1 ) >= 0 && ( y - 1 ) < 10 )  
        {  
            this.insert_to_opentable( x, y-1, curr_node, 10 );  
        }  
    
        if ( ( x + 1 ) >= 0 && ( x + 1 ) < 10 && ( y + 1 ) >= 0 && ( y + 1 ) < 10 )  
        {  
            this.insert_to_opentable( x+1, y+1, curr_node, 14 );  
        }  
    
        if ( ( x + 1 ) >= 0 && ( x + 1 ) < 10 && ( y - 1 ) >= 0 && ( y - 1 ) < 10 )  
        {  
            this.insert_to_opentable( x+1, y-1, curr_node, 14 );  
        }  
    
        if ( ( x - 1 ) >= 0 && ( x - 1 ) < 10 && ( y + 1 ) >= 0 && ( y + 1 ) < 10 )  
        {  
            this.insert_to_opentable( x-1, y+1, curr_node, 14 );  
        }  
    
        if ( ( x - 1 ) >= 0 && ( x - 1 ) < 10 && ( y - 1 ) >= 0 && ( y - 1 ) < 10 )  
        {  
            this.insert_to_opentable( x-1, y-1, curr_node, 14 );  
        }  
    }  
    
        
}

class MapNode{
    public x:number;
    public y:number;
    public WalkAble:boolean;
    public f:number;
    public g:number;
    public h:number;
    public parent:MapNode;
   

    public constructor(x:number, y:number)
    {
        this.x=x;
        this.y=y;
    }
    public compare(n:MapNode):boolean{
        if(this.x==n.x&&this.x==n.y)
        {
            return true;
        }
        return false;
    }
}
