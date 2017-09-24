/////////////////////ejercicio 1 ppt////////////////////////////////
enCuantasOcurreIter(m, x){
	let count = 0;
	for(let i = 0; i < m.length; i++)
		for(let j = 0; j< m[i].length; j++)
			if(m[i][j]===x)
				count++
	return count;
}

enCuantasOcurreFunc(m, x){
	return m.reduce((z,e)=>z+e.reduce((z,e)=>e===x?z+1:z, 0), 0);
}


//////////////////////ejercicio 2 ppt////////////////////////////////
sumaEnParesIter(a){
	let suma = 0; 
	for (let i = 0; i < a.length; i+=2)
		suma+=a[i];
	return suma;
}
sumaEnParesFunc(a){
	return a.reduce((z,e,i)=>i%2?z:z+e,0);
}

//////////////////////ejercicio 7 practica///////////////////////////
function maxMin(a){
	return a.reduce((z,e)=>[e<z[0]?e:z[0],e>z[1]?e:z[1]],[Infinity,-Infinity]).reduce((z,e)=>z+e)/2
}
///////////////////////ejercicio 8 practica///////////////////////////
function containsRec(x, l, f = (x, v) => x==v){
	if(f(x, l[0]))
		return true;
	if(l.length>0)
		containsRec(x,l.slice[1],f)
	return false;
}
function containsRed(x, l, f = (x, v) => x==v){
	return l.reduce((z, e) => z?z:f(x, e), false)
}
////////////////////////////////
function merge(x,y){
	return Array.from(x.concat(y)).reduce(z=>mergeConc(z[0],x,y,z[1],z[2]),[new Array(),0,0])[0]
}
function mergePreg(x,y,i,j){
	return (x[i]||Infinity)<=(y[j]||Infinity);
}
function mergeConc(z,x,y,i,j){
	return [mergePreg(x,y,i,j)?z.concat(x[i++]):z.concat(y[j++]), i, j]
}

function mergeSort(a){
	return mergeRec(a.slice(0,Math.floor(a.length/2)),a.slice(Math.floor(a.length/2),a.length))
}
function mergeRec(x,y){
	if(x.length==1&&y.length==1)
		return merge(x,y);
	if(x.length==1&&y.length!=1)
		return merge(x,mergeSort(y))
	if(x.length!=1&&y.length==1)
		return merge(y,mergeSort(x))
	return merge(mergeSort(x),mergeSort(y));
}
/////////////////////////////////////////

function copyRec(x, n){
	if(n-1)
		return (new Array()).concat(x,copyRec(x,n-1));
	return (new Array()).concat(x);
}
function copyFun(x, n){
	return (new Array(n)).fill(x);
}
////////////////////////////////////////
function prodIntRec(a,b){
	if(a.length)
		return a[0]*b[0]+prodIntRec(a.slice(1),b.slice(1))
	return 0;
}
function prodIntFun(a,b){
	return a.reduce((z,e,i)=>z+(e*b[i]),0);
}
////////////////////////////////////////
function split(l, pivot, f){
	return l.reduce((z,e)=>f(e, pivot)?[z[0].concat(e),z[1]]:[z[0],z[1].concat(e)],[new Array(),new Array()]);
}
////////////////////////////////////////
function majority(l){
	let x=Mathl.reduce((z,e)=>e?z+1:z-1,0)
	let p=x>0?true:x<0?false:null
	return {d:Math.abs(x),f:p}
}