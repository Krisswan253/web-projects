window.onload = () => {

    // we need to make a fetch request to the server /datanase to retrive the posts that currently exist 

    loadPosts()


}

async function loadPosts(){
const postContainer = document.getElementById('all-posts')

    const postsArray = await fetch('/populate-posts')
    const json = await response.json()
    //console.log(response)
    //console.log(json)

    for (let post of postsArray){
        //creates the div that will hold all the post data and add post class
        let newDiv = document.createElement('div')
        newDiv.classList.add('post')

       // newDiv.textContent = post.postText
       //span that holds the time 
       let span = document.createElement('span')
       span.textContent = post.postTime

        //paragraph that holds the text from the database
       let paragraphText = dcoument.createElement ('p')
       paragraphText.textContent = post.postText

       //create button to delete posts
       let deleteButton = document.createElement
       ('button')
        // grab the individual id by using post._id
       deleteButton.textContent='x'

       let id =post._id
         deleteButton.addEventListener('click', ()=>{
            handleClick(post._id)
         })

       newDiv.append(span)
       newDiv.append(paragraphText)

       postContainer.append(newDiv)
    }
}

async function handleClick(postId){
    console.log('button was clicked' + postId)
    let request = await fetch ('//delete-post',{
        //method is the type of request
        method: "DELETE",
        //body is the dats sent in json format
        body: JSON.stringify({id: postId}),
        //headers are what type of data the server should expect
        headers: {
            "Content-Type": "application/json"
        }

    }).then(()=>{
        window.location.href = '/'
    })


}