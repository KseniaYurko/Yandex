elem = document.querySelector('entry');

function solution(element) {
    const copyAttr = element.getAttribute('x-make');

//COPY ------------------------------------------------------------------------------------------------------//
    if (copyAttr && copyAttr.startsWith("copy:")){
      const count = parseInt(copyAttr.substring(5));
      element.removeAttribute("x-make");

      for (let i = 0; i < count; i++) {
        const clone = element.cloneNode(true);
        element.parentNode.insertBefore(clone, element.nextSibling);
      }
    }
    
//REMOVE ----------------------------------------------------------------------------------------------------//
    if (copyAttr && copyAttr.startsWith("remove:")){
        
        const count = parseInt(copyAttr.substring(7));
        element.removeAttribute("x-make");
        for(let i = 0; i < count; i++){
            let next = element.nextElementSibling;
            if(next){
                next.parentNode.removeChild(next); 
            }
            else
                break;
        } 
    }
  
//REMOVE CHILDREN --------------------------------------------------------------------------------------------//
    if (copyAttr && copyAttr.startsWith('removeChildren:')) {
        element.removeAttribute('x-make');
        const count = parseInt(copyAttr.substring(15));

        for (let i = 0; i < count && element.firstElementChild; i++) {
            element.removeChild(element.firstElementChild);
        }
      
    }
  
//SWITCH -----------------------------------------------------------------------------------------------------//
    if (copyAttr && copyAttr.startsWith('switch:')) {
        const count = parseInt(copyAttr.substring(7));
        element.removeAttribute('x-make');

        const targetIndex = (Array.from(element.parentNode.children).indexOf(element) + count) % element.parentNode.children.length;
        const target = element.parentNode.children[targetIndex];

        if (target) {
            const afterTarget = target.nextElementSibling;
            const parent = target.parentNode;

            element.replaceWith(target);
            parent.insertBefore(element, afterTarget);
        } 
    }

//ENUMERATION OF ELEMENTS ------------------------------------------------------------------------------------//
    chil = Array.from(element.children);

    
    for(let i = 0; i < 5; i++){
        for(let j = 0; j < Array.from(element.children).length; j++){
 
            let child = Array.from(element.children)[j];
            let xMakeChild_j = child.getAttribute('x-make');

            switch (i){
                case 0:
                    
                    if(xMakeChild_j && xMakeChild_j.startsWith('copy:')){
                        let count = parseInt(xMakeChild_j.substring(5));                        
                        solution(child);                       
                        j += count;                       
                    }
                    continue;
                    
                case 1:
                    if(xMakeChild_j && xMakeChild_j.startsWith('remove:')){
                        solution(child);    
                    }
                    continue;
                    
                case 2:
                    if(xMakeChild_j && xMakeChild_j.startsWith('removeChildren:')){
                        solution(child);

                       
                    }
                    continue;

                case 3:
                    let chil = Array.from(element.children);
                    let makeFlg = 1;
                    while(makeFlg){
                        makeFlg = 0;
                        for(let k = 0; k < chil.length && makeFlg == 0; k++){
                            if(chil[k].getAttribute('x-make') && chil[k].getAttribute('x-make').startsWith('switch:')){
                                solution(chil[k]);
                                makeFlg = 1; 
                            }
                        }
                    }
                    continue;

                case 4: 
                    solution(child);
            }       
        }    
    }
}