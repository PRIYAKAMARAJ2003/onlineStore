let ratingStarInput = [...document.querySelectorAll('.rating-star')];

ratingStarInput.map((star, index) => {
    star.addEventListener('click',() =>{
        for(let i = 0;i<5;i++){
            if(i <= index){
                ratingStarInput[i].src = 'image/fill star.png'
            }else{
                ratingStarInput[i].src = 'image/no fill star.png'
            }
        }
    })
})