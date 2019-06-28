
type action0 = ()=>void;
export class Action0
{
    invoke(){
        for(let f of this._funcs){
            f();
        }
    }
    
    add(f:action0){
        if(!this._funcs.includes(f))
            this._funcs.push(f);
    }
    remove(f:action0){
        let index = this._funcs.indexOf(f);
        if(index >=0 )
            this._funcs.splice(index,1);
    }
    removeAll(){
        this._funcs=[]
    }
    private _funcs:action0[] = []
}

type action1<T1> = (t1:T1)=>void;
export class Action1<T1>
{
    invoke(t1:T1):void{
        for(let f of this._funcs){
            f(t1);
        }
    }
    
    add(f:action1<T1>){
        if(!this._funcs.includes(f))
            this._funcs.push(f);
    }
    remove(f:action1<T1>){
        let index = this._funcs.indexOf(f);
        if(index >=0 )
            this._funcs.splice(index,1);
    }
    removeAll(){
        this._funcs=[]
    }

    private _funcs:action1<T1>[] = []
}

type action2<T1,T2> = (t1:T1,t2:T2)=>void;
export class Action2<T1,T2>
{
    invoke(t1:T1,t2:T2):void{
        for(let f of this._funcs){
            f(t1,t2);
        }
    }
    
    add(f:action2<T1,T2>){
        if(!this._funcs.includes(f))
            this._funcs.push(f);
    }
    remove(f:action2<T1,T2>){
        let index = this._funcs.indexOf(f);
        if(index >=0 )
            this._funcs.splice(index,1);
    }
    removeAll(){
        this._funcs=[]
    }
    private _funcs:action2<T1,T2>[] = []
}

type action3<T1,T2,T3> = (t1:T1,t2:T2,t3:T3)=>void;
export class Action3<T1,T2,T3>
{
    invoke(t1:T1,t2:T2,t3:T3):void{
        for(let f of this._funcs){
            f(t1,t2,t3);
        }
    }
    
    add(f:action3<T1,T2,T3>){
        if(!this._funcs.includes(f))
            this._funcs.push(f);
    }
    remove(f:action3<T1,T2,T3>){
        let index = this._funcs.indexOf(f);
        if(index >=0 )
            this._funcs.splice(index,1);
    }
    removeAll(){
        this._funcs=[]
    }
    private _funcs:action3<T1,T2,T3>[] = []
}

function test(){
    let a = new Action1<string>();
    a.add((msg: string) =>{console.log("hi:", msg)})
    a.invoke("world");
}
test();