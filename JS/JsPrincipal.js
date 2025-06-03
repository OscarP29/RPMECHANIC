document.addEventListener('DOMContentLoaded',function(){
    window.abrirEnOtraPestana = function(ruta,localicion) {
        if(localicion){
             window.open(ruta+".html","_self");
        }else{
             window.open("html/"+ruta+".html","_self");
        }
       
    }
    window.changeImage = function(element) {
            const mainImage = document.getElementById('mainImage');
            mainImage.src = element.src;
            document.querySelectorAll('.thumbnail-img').forEach(img => {
                img.classList.remove('BorderImg');
            });
            element.classList.add('BorderImg');
    }
})