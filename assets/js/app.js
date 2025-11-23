 let cl=console.log;

const blogForm=document.getElementById("blogForm");
const titlecontrol=document.getElementById("title");
const contentcontrol=document.getElementById("content");
const useridcontrol=document.getElementById("userid");
const subbtn=document.getElementById("subbtn");
const upbtn=document.getElementById("upbtn");
const postContainer=document.getElementById("postContainer");
const loader=document.getElementById("loader");


let BASE_URL=`https://jsonplaceholder.typicode.com`

let POST_URL=`${BASE_URL}/posts`




function snackbar(title, icon){
    Swal.fire({
        title,
        icon,
        timer: 2500
    })
}

//_________________________templating________________//
function createCards(arr){
    let result=arr.map(post=>{
        return `<div class="card mt-3" id="${post.id}">
                <div class="card-header">
                <h3 class="mb-0">${post.title}</h3>
                </div>
                <div class="card-body">
                <p>${post.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-outline-primary" onclick="Onedit(this)">edit</button>
                    <button type="button" class="btn btn-outline-danger " onclick="onremove(this)">delete</button>
                </div>
            </div>
      `
    }).join('')
  postContainer.innerHTML=result;  
}


//_________________________fetchAllBlogs________________//
function FetchAllPost(){

loader.classList.remove('d-none')


let xhr=new XMLHttpRequest()




xhr.open("GET", POST_URL)
xhr.setRequestHeader('auth', 'token from LS')


//3
xhr.onload=function(){
 if(xhr.status>=200&&xhr.status<=300&&xhr.readyState===4){
   let data=JSON.parse(xhr.response)
  cl(data)
 createCards(data)
 }
 else{
   
 }

  loader.classList.add('d-none')
}

xhr.send(null)



}


FetchAllPost()

//_________________________remove_obj________________//
function onremove(ele){
Swal.fire({
  title: "Are you sure?",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
     loader.classList.remove('d-none')
    let rId=ele.closest('.card').id;
    cl('click')

   
    let remove_url=`${BASE_URL}/posts/${rId}`

   let xhr= new XMLHttpRequest();

  xhr.open("DELETE", remove_url);

  xhr.onload=function(){
    if(xhr.status>=200&&xhr.status<300&&xhr.readyState===4){
        let res=xhr.response;
        cl(res)
        ele.closest('.card').remove(); 

        snackbar(`blog deleted successfully`, `success`)
    }else{
        snackbar(`something went wrong`, `error`)
    }

    loader.classList.add('d-none')
}
  xhr.send(null)
    
  }
});

   
}

//_________________________edit_obj________________//
function Onedit(ele){
    let eId=ele.closest('.card').id;
    localStorage.setItem('edit_id', eId)


   
    let edit_url=`${BASE_URL}/posts/${eId}`
  loader.classList.remove('d-none');
 
    let xhr=new XMLHttpRequest();

    xhr.open("GET", edit_url)

    xhr.onload=function(){
        if(xhr.status>=200&&xhr.status<300&&xhr.readyState===4){
           let res=JSON.parse(xhr.response)

           titlecontrol.value=res.title;
           contentcontrol.value=res.body;
           useridcontrol.value=res.userId;

           subbtn.classList.add('d-none');
           upbtn.classList.remove('d-none');
       
        }else{
            snackbar('something went wrong while fetching blog', 'error')
        }
          loader.classList.add('d-none');
    }

    xhr.send(null)
    
}

//_________________________update_obj________________//
function onupdatebtn(){
    let u_id=localStorage.getItem('edit_id');

    let u_obj={
        title: titlecontrol.value,
        body: contentcontrol.value,
        userId: useridcontrol.value,
        id: u_id
    }

let update_url=`${BASE_URL}/posts/${u_id}`

   loader.classList.remove('d-none');

let xhr=new XMLHttpRequest()

xhr.open("PATCH", update_url)

xhr.onload=function(){
   if(xhr.status>=200&&xhr.status<300&&xhr.readyState===4){
    let res=JSON.parse(xhr.response) 
    let card = document.getElementById(u_id);
     card.querySelector(".card-header h3").innerText = u_obj.title;
     card.querySelector(".card-body p").innerText = u_obj.body;

       blogForm.reset();
            upbtn.classList.add("d-none");
            subbtn.classList.remove("d-none");
            snackbar(`Post ID ${u_id} updated successfully`, "success");
        } else {
            snackbar(`Something went wrong while updating`, "error");
        }
        loader.classList.add('d-none');
           
}
  xhr.send(JSON.stringify(u_obj));
}


//-----------------submit-----------------------//
function onPostSubmit(eve){
    eve.preventDefault();


    
    let postObj={
        title: titlecontrol.value,
        body: contentcontrol.value,
        userId: useridcontrol.value,
    }
    cl(postObj)
   eve.target.reset()

    loader.classList.remove('d-none')
 
   let xhr=new XMLHttpRequest()

   
    xhr.open("POST", POST_URL)
    xhr.setRequestHeader('auth','token from LS');

   
   xhr.onload=function(){
    if(xhr.status>=200&&xhr.status<300){

   let res=JSON.parse(xhr.response)
   cl(res)
      
  
   let card=document.createElement('div')
   card.className=`card mt-3`
   card.id=res.id;
   card.innerHTML =` <div class="card-header">
                <h3 class="mb-0">${postObj.title}</h3>
                </div>
                <div class="card-body">
                <p>${postObj.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-outline-primary" onclick="Onedit(this)">edit</button>
                    <button type="button" class="btn btn-outline-danger " onclick="onremove(this)">delete</button>
                </div>`
postContainer.append(card)
 snackbar('new card created successfully', 'success')   
}
    else{
        snackbar('something went wrong', 'error') 
    }

    loader.classList.add('d-none')
}
    xhr.send(JSON.stringify(postObj))

}


blogForm.addEventListener("submit", onPostSubmit)
upbtn.addEventListener("click", onupdatebtn)




