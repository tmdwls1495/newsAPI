const API_KEY =  `ce9e75c4c7814be1ac886bbf0386c36c`;
let newsList = []
const menus = document.querySelectorAll(".menus")
menus.forEach(menu=>menu.addEventListener("click",(event)=>getNewsByCategory(event)));
let url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`)

let totalResult = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5



const getNews = async() =>{
    try{
        url.searchParams.set("page", page) // &page = page
        url.searchParams.set("pageSize", pageSize) // &page = page
        const response = await fetch(url);
        const data = await response.json();
        console.log("rs", response.status)
        if(response.status === 200 
        ){
            if(data.articles.length === 0){
                throw new Error("No result for this search")

            }
            newsList = data.articles;
            totalResult = data.totalResults
            render();
            paginationRender();
        }else{
            throw new Error(data.message)
        }
        
    }
    catch(error){
        console.log("error", error.message)
        errorRender(error.message)
    }
   /* url.searchParams.set("page", page) // &page = page
        url.searchParams.set("pageSize", pageSize) // &page = page
        const response = await fetch(url);
        const data = await response.json();
        newsList = data.articles;
        totalResult = data.totalResults
        render();s
        paginationRender();*/
}


const getLatestNews = async() =>{
     url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);

    getNews();
};

const getNewsByCategory = async (event) => {
    const category = event.target.textContent.toLowerCase();
    url = new URL(
    `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`);
    getNews();
}

const getNewsByKeyword = async() => {
    const keyword = document.getElementById("search-input").value;
     url = new URL(
        `https://newsapi.org/v2/top-headlines?country=us&q=${keyword}&apiKey=${API_KEY}`
    );
    getNews();
}


const render=()=>{
    const newsHTML = newsList.map(
        news=> `
    <div class="row news">
    <div class="col-lg-4">
        <img class="news-img-size" 
                    src=${news.urlToImage}/>
    </div>
    <div class="col-lg-8">
        <h2>${news.title}</h2>
         <p>
          ${news.description}
         </p>
        <div>
            ${news.source.name} * ${news.publishedAt}
         </div>
     </div>
</div>`
).join("");
    document.getElementById('news-board').innerHTML=newsHTML;
}

const errorRender = (errorMessage) => {
    const errorHTML = 
      `<div class="alert alert-danger" role="alert">
      ${errorMessage}
      </div>`;

      document.getElementById('news-board').innerHTML = errorHTML;
  }

  const paginationRender = () => {
    const pageGroup = Math.ceil(page / groupSize);
    const lastPage = pageGroup * groupSize;
    const totalPages = Math.ceil(totalResult / pageSize)
    if(lastPage > totalPages){
        lastPage = totalPages;
    }
    const firstPage = (lastPage - (groupSize - 1)) <= 0 ? 1: lastPage - (groupSize - 1) ;
    
    let paginationHTML = ` <li class="page-item" onclick = "moveToPage(${firstPage})" ><a class="page-link" href="#" color="black">처음으로</a></li>
                            <li class="page-item" onclick = "moveToPage(${page-1})" ><a class="page-link" href="#">이전</a></li>`
    for(let i = firstPage; i<= lastPage; i++){
        paginationHTML += `<li class="page-item ${i === page? "active" : ""}" onclick = "moveToPage(${i})"><a class="page-link">${i}</a></li>`
    }
    paginationHTML += ` <li class="page-item" onclick = "moveToPage(${page+1})"><a class="page-link" href="#">다음</a></li>
                         <li class="page-item" onclick = "moveToPage(${lastPage})"><a class="page-link" href="#">맨 끝으로</a></li>`
    document.querySelector(".pagination").innerHTML = paginationHTML;

  }
  const moveToPage = (pageNum) => {
    console.log(pageNum)
    page = pageNum;
    getNews();
  }

  getLatestNews();