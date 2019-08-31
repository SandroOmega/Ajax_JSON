let myDiv = document.createElement('div'),
jsonHttp = document.createElement("input"),
jsonGet = document.createElement('button'),
jsonStatus = document.createElement('div'),
jsonNumberOfErrors = document.createElement('div'),
jsonNumberOfWarnings = document.createElement('div'),
htmlJSON;

jsonHttp.value = 'ajax_json.json';


jsonGet.innerHTML='GET';



document.body.appendChild(myDiv);

// myDiv.onmousedown = function(e) {

//   var coords = getCoords(myDiv);
//   var shiftX = e.pageX - coords.left;
//   var shiftY = e.pageY - coords.top;
//   console.log(shiftX);
//   console.log(shiftY);
//   myDiv.style.position = 'absolute';
//   document.body.appendChild(myDiv);
//   moveAt(e);

//   myDiv.style.zIndex = 0; // над другими элементами

//   function moveAt(e) {
//     myDiv.style.left = e.pageX - shiftX + 'px';
//     myDiv.style.top = e.pageY - shiftY + 'px';
//   }

//   document.onmousemove = function(e) {
//     moveAt(e);
//   };

//   myDiv.onmouseup = function() {
//     document.onmousemove = null;
//     myDiv.onmouseup = null;
//   };

// }

// myDiv.ondragstart = function() {
//   return false;
// };

// function getCoords(elem) {   // кроме IE8-
//   var myDiv = elem.getBoundingClientRect();
//   return {
//     top: myDiv.top + pageYOffset,
//     left: myDiv.left + pageXOffset
//   };
// }

myDiv.appendChild(jsonHttp);
myDiv.appendChild(document.createElement('br'));
myDiv.appendChild(jsonGet);


function lengthInUtf8Bytes(str) {
    var m = encodeURIComponent(str).match(/%[89ABab]/g);
    return str.length + (m ? m.length : 0);
  }

function FindEl(arr,txt){
    let sum =0;
    arr.forEach(el => {
        if(el[txt]!= undefined){
            sum += el[txt].length;
        }
    });
    return ("Number of "+txt+ " in JSON are " + sum);
}

function memorySizeOf(obj) {
    var bytes = 0;

    function sizeOf(obj) {
        if(obj !== null && obj !== undefined) {
            switch(typeof obj) {
            case 'number':
                bytes += 8;
                break;
            case 'string':
                bytes += obj.length * 2;
                break;
            case 'boolean':
                bytes += 4;
                break;
            case 'object':
                var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                if(objClass === 'Object' || objClass === 'Array') {
                    for(var key in obj) {
                        if(!obj.hasOwnProperty(key)) continue;
                        sizeOf(obj[key]);
                    }
                } else bytes += obj.toString().length * 2;
                break;
            }
        }
        return bytes;
    };

    function formatByteSize(bytes) {
        if(bytes < 1024) return bytes + " bytes";
        else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KiB";
        else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MiB";
        else return(bytes / 1073741824).toFixed(3) + " GiB";
    };

    return formatByteSize(sizeOf(obj));
};


jsonGet.addEventListener('click',()=>{

    function prms()
    {
        return new Promise((resolve,reject)=>{
        let request = new XMLHttpRequest();
            request.open('GET',jsonHttp.value);
            request.setRequestHeader('Content-type','application/json; charset=utf-8');
            request.send();
            request.onload = function()
            {
                if (request.readyState==4){
                    if (request.status==200){
                        alert(this.statusText);
                        alert ("Size "+memorySizeOf(this.response));
                        return resolve(this.response);
                    }else {
                        alert(this.statusText);
                        return reject();
                    }
                }
            }
        });
    }

    function createTree(data, nodeName,treeClass, isRoot= false){
        let root = document.createElement('li');
        root.appendChild(document.createTextNode(nodeName));
        if (isRoot){
            var tree = document.createElement('ul');
            tree.className=treeClass;
            tree.appendChild(root);
        }else{
            root.className=treeClass;
        }
        
        let listofAttr= document.createElement('ul');
        root.appendChild(listofAttr);
        
        for (let i in data){
            if(typeof(data[i])=='object'){
                listofAttr.appendChild(createTree(data[i],i,i));
            }
            else{
                 let attr = document.createElement('li');
                 attr.appendChild(document.createTextNode(i +" : " + data[i]));
                 attr.className=i;

                 listofAttr.appendChild(attr);
            }
        }
        if(isRoot){
            return tree;
        }else{
            return root;
        }
    }

    prms()
    .then(response=>{
        let data = JSON.parse(response);
        alert(FindEl(data,'error')+ ". " + FindEl(data,'warning')+". ");
        
        let treeCSS ="treeCSS";
        if (htmlJSON){
            myDiv.removeChild(htmlJSON);
        }
            
        htmlJSON = createTree(data,'JSON', treeCSS,true);
        myDiv.appendChild(htmlJSON);
        
    })
    .then(()=>{
        var ul = document.querySelectorAll('.treeCSS > li:not(:only-child) ul, .treeCSS ul ul');
        for (var i = 0; i < ul.length; i++) {
          var div = document.createElement('div');
          div.className = 'drop';
          div.innerHTML = '+'; // картинки лучше выравниваются, т.к. символы на одном браузере ровно выглядят, на другом — чуть съезжают 
          ul[i].parentNode.insertBefore(div, ul[i].previousSibling);
          div.onclick = function() {
            this.innerHTML = (this.innerHTML == '+' ? '−' : '+');
            this.className = (this.className == 'drop' ? 'drop dropM' : 'drop');
          }
        }    
    });    
    
});


    