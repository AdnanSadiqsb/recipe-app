const mealsEl = document.getElementById('meals')

const fav_mealEl = document.getElementById('fav-meals')

const Search_termEL = document.getElementById('search-term')
const searchEL = document.getElementById('search')

const btnnext = document.getElementById('next')

const btnMore = document.getElementById('more');

const ingreEl = document.getElementById('ingridians')

const detailpara = document.getElementById('detail-para')

const meals_popup_contEl = document.getElementById('meal-popup-container')
const meals_infoEl = document.getElementById('meal-info-popup')

const btnclose = document.getElementById('close-popup')

fetchFavMEeals()

async function getRandomMeal() {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');

    const respData = await resp.json();
    const randomMeal = respData.meals[0];
    console.log(randomMeal);

    addmeal(randomMeal, true);
    // btnMore.addEventListener('click', () => {
    //     detailofRecipe(randomMeal);
    // })

}


getRandomMeal()
async function getMealbyId(id) {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id)
    const respData = await resp.json();
    const Mealbyid = respData.meals[0];
    // console.log(Mealbyid);
    return Mealbyid;


}

async function getMealBySearch(term) {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term)
    const respData = await resp.json();
    const MealBySearch = respData.meals;
    // console.log(Mealbyid);

    return MealBySearch;

}


function addmeal(mealData, random = false) {
    // meals.innerHTML = '';
    const meal = document.createElement('div');
    meal.classList.add('meal');

    meal.innerHTML = (`  
    <div class="meal-head">
       ${random ?` <span class="random">
       Random Recipe
   </span>`:`<span class="random">${Search_termEL.value}
</span>`}
        <img id="info-img" src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    </div>
    <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button class="fav-btn" >
            <i class="fa-regular fa-heart"></i>
        </button>
    </div>
    `)

    const fav_btn=meal.querySelector('.meal-body .fav-btn');

    fav_btn.addEventListener('click',()=>{
        if(fav_btn.classList.contains('active'))
    {
        removeMealFromLS(mealData.idMeal)
        fav_btn.classList.remove('active');

    }
        else
    {
        addMealToLoacalStorage(mealData.idMeal)
        fav_btn.classList.add('active')
       
    }
        htmlstr=""
        fetchFavMEeals();
    // fav_btn.classList.toggle('active');

   

    });

    mealsEl.appendChild(meal)

    const mealinfoImg=meal.querySelector('#info-img') 
    mealinfoImg.addEventListener('click',()=>{
        viewMealInfo(mealData)
    });
}

// localStorage.removeItem('mealIds')
function addMealToLoacalStorage(mealid)
{
    const mealIDs =getMealFromLS();
    localStorage.setItem('mealIds',JSON.stringify([...mealIDs,mealid]))
    //  localStorage.clear('mealIds')
    console.log("hlo")
}
// localStorage.setItem('mealIds',[1])
// addMealToLoacalStorage()

function getMealFromLS()
{
    const mealIDs=JSON.parse( localStorage.getItem('mealIds'));
    return mealIDs == null ?[]:mealIDs;
}

function removeMealFromLS(mealid)
{
    const mealIDs =getMealFromLS();
    localStorage.setItem('mealIds',JSON.stringify(mealIDs.filter(id =>id!= mealid)));

    //  localStorage.clear('mealIds')
    console.log("hlo")

}


async function fetchFavMEeals()
{
    fav_mealEl.innerHTML=''
    const mealIDs=getMealFromLS();
    const meals=[]
    for(let i=0;i<mealIDs.length;i++)
    {
        const mealid =mealIDs[i];
        const meal=await getMealbyId(mealid);
        meals.push(meal);

        addMealToFavourite(meal);
    }

    
   
    // add the favourite meals to the screen


}

function viewMealInfo(mealData)
{
    meals_popup_contEl.classList.remove('hidden')

    meals_infoEl.innerHTML=''

    const mealEl=document.createElement('div')

    const ingrediants=[]
    for(let i=1;i<=20;i++)
    {
        if(mealData['strIngredient'+i])
        {
            ingrediants.push(`${mealData['strIngredient'+i]} / ${mealData['strMeasure'+i]}`)
        }
        else{
            break;
        }
    }
    str='<hr>'
    mealEl.innerHTML=`
    <h1>${mealData.strMeal}</h1>
    <img src="${mealData.strMealThumb}" alt="">

    <div>
    <p>
    ${mealData.strInstructions }
    </p>
    <h3>ingrediants:</h3>
    <ul>
        ${ ingrediants.map((ing)=>
            `<li>${ing}</li>`
        ).join("")
        }
        
    

    </ul>
</div>
    `
        console.log(mealEl)
    meals_infoEl.appendChild(mealEl)

    //show the popu
    
}


function addMealToFavourite(mealData)
{
    const fav_meal=document.createElement('li')
    

    // console.log(meal)
    fav_meal.innerHTML= (`<img id="fav-img" class="fav-img" src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    <p>${mealData.strMeal}</p>
    <button class="close" id="close"><i class="fa-solid fa-circle-xmark"></i></button>
    `)

    const favimgEl=fav_meal.querySelector('#fav-img')
    const closeBtn=fav_meal.querySelector('.close');
    closeBtn.addEventListener('click',()=>{

        removeMealFromLS(mealData.idMeal)
        fetchFavMEeals();
    });


    fav_mealEl.appendChild(fav_meal)
   
    favimgEl.addEventListener('click',()=>{
        viewMealInfo(mealData)
    })
}


searchEL.addEventListener('click',async ()=>{
    mealsEl.innerHTML=''
   const searchval= Search_termEL.value;
   const serchData=await getMealBySearch(searchval);
   if(serchData)
   {

       serchData.forEach((data)=>{
           addmeal(data);
           
        })
    }
})


btnnext.addEventListener(('click'), ()=>{
    mealsEl.innerHTML=''
getRandomMeal();
ingreEl.innerHTML=null;
detailpara.innerHTML=''
});
/*
function detailofRecipe(mealData)

{


    lstingredians=getIngrdianslist(mealData,"strIngredient")
    lstmeasure=getIngrdianslist(mealData,"strMeasure")

    console.log(lstingredians)
    console.log(lstmeasure)
    const strhtml=''
    ingreEl.innerHTML=''
    lstingredians.forEach((item,index)=>{
        console.log(item,index)
        ingreEl.innerHTML+=`<li class="ingridians">
        <p>${item}</p>
        <p class="secondp">${lstmeasure[index]}</p>
    </li>`
    detailpara.innerHTML=`<p>${mealData.strInstructions}</p>`

    });

}

function getIngrdianslist(mealData,str)
{
    mealList=[]
    console.log(mealData.idMeal)
    for (let i=1;i<20;i++)
    {
        let st=`${str}${i}`;
        if(mealData[st]!=="")
        {
            mealList.push(mealData[st])

        }
        else{
            break;
        }
    }
    return mealList;
}
*/

btnclose.addEventListener('click',()=>{
    meals_popup_contEl.classList.add('hidden')
    
})