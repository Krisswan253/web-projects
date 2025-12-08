window.onload = () => {
    // when the page loads, get all posts from the server
    loadPosts()
    // if you later fix /visits to return JSON, you can call:
    // loadVisits()
}

async function loadPosts() {
    const postContainer = document.getElementById('all-posts')

    // request all posts from the server
    const response = await fetch('/populate-posts')
    const postsArray = await response.json()
    // console.log(response)
    // console.log(postsArray)

    for (let post of postsArray) {
        // create the div that will hold one post
        let newDiv = document.createElement('div')
        newDiv.classList.add('post')

        // span that holds the time
        let span = document.createElement('span')
        span.textContent = post.postTime

        // paragraph that holds the text from the database
        let paragraphText = document.createElement('p')
        paragraphText.textContent = post.postText

        // button to delete posts
        let deleteButton = document.createElement('button')
        deleteButton.textContent = 'x'

        // like button
        let likeButton = document.createElement('button')
        likeButton.textContent = '<3'

        // grab the individual id by using post._id
        deleteButton.addEventListener('click', () => {
            handleClick(post._id)
        })

        likeButton.addEventListener('click', () => {
            handleLike(post._id)
        })

        newDiv.append(deleteButton)
        newDiv.append(span)
        newDiv.append(paragraphText)
        newDiv.append(likeButton)

        postContainer.append(newDiv)
    }
}

async function handleClick(postId) {
    console.log('button was clicked ' + postId)

    await fetch('/delete-post', {
        // method is the type of request
        method: 'DELETE',
        // body is the data sent in json format
        body: JSON.stringify({ id: postId }),
        // headers tell the server what type of data to expect
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(() => {
        window.location.href = '/'
    })
}

async function handleLike(postId) {
    console.log('like button was clicked ' + postId)

    await fetch('/like', {
        method: 'POST',
        body: JSON.stringify({ id: postId }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(() => {
        // reload the page so you can see the new like count
        window.location.href = '/'
    })
}

async function loadVisits() {
    const visitsContainer = document.getElementById('visits')

    // this will not work until /visits sends JSON from the server
    const response = await fetch('/visits')
    const json = await response.json()

    // example if server sent { visits: 5 }
    visitsContainer.textContent = 'number of visits: ' + json.visits
}
