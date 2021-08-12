// Create global variable to select the div with the class of 'overview'
const profileInfo = document.querySelector(".overview");
// Create a global variable to represent your github profile name
const username = "JamesG-Chef";
// Create a global variable to select the unordered list that displays the repos list.
const repoList = document.querySelector(".repo-list");
// Create a global variable that selects the section with a class of 'repos'
const repoContainer = document.querySelector(".repos");
// Create a global variable that selects the secion with a class of "repo-data";
const repoData = document.querySelector(".repo-data");


// Create an async function to fetch data from your github profile using the github API
const gitUserInfo = async function () {
	// target the 'users' end point (remember to use backticks to surround the template literal)
	const userInfo = await fetch (`https://api.github.com/users/${username}`);
	// In your next await statement, resolve the JSON response.  
	const data = await userInfo.json();
	// Log out the response to the console
	console.log(data);

	// Call the function created to display the data retrieved 
	displayUserInfo(data);
};
// Call your function to see your results.
gitUserInfo();


const displayUserInfo = function (data) {
	// create a new div and give it a class of “user-info”. 
	const div = document.createElement("div");
	div.classList.add("user-info");
	// Using innerHTML, populate the div, with the following elements for figure, image, and paragraphs:
	// Inside the 5 placeholders, use the JSON data to grab the relevant properties to display on the page
	div.innerHTML = `
	<figure>
      <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div> 
    `;
    // Append the div to the overview element
    profileInfo.append(div);
    // Call the function to include the repo data that was grabbed by the 'displayRepoInfo' function
    fetchRepos();
};




// create and name a new async function to fetch your repos
const fetchRepos = async function () {
	// target the endpoints that fetch the list of repos 
	// (include parameters to sort most recently updated and 100 per page)
	const fetchList = await fetch (`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
	const data = await fetchList.json();
	console.log(data);

	// call the function to display the repo info, pass it the json response data as an argument
	displayRepos(data);
};

// create and name a function to display information about each repo
// Use 'repos' as a parameter so that the function accepts the data returned from your last API call
const displayRepos = function (repos) {
	// Inside the function, loop and create a list item for each repo 
	for (const repo of repos) { // For each element (repo), within the array (repos)
		const repoItem = document.createElement("li"); // Create the list item
		// give each item a class of “repo”.
		repoItem.classList.add("repo");
		// give each item an <h3> element with the repo name.
		repoItem.innerHTML = `<h3>${repo.name}</h3>`;
		// Append the list item to the global variable that selects the unordered repos list (at the top of the page).
		repoList.append(repoItem);
	}
};

// Create an event listener called 'repoList' for a click event on the unorderedlist with a class of "repo-list", 
// pass the event (e) in the callback function

repoList.addEventListener("click", function (e) {
	// Add a conditional statement that checks if the event target matches the <h3> element (it's name)
	if (e.target.matches("h3")) {
		// create a variable called repoName that targets the innertext where the event happens
		const repoName = e.target.innerText;
		// log out the results to check the click event is working
		console.log(repoName);
		// Call the function created below which grabs the repo information
		getRepoInfo(repoName);

	}
});

// create and name an async function to get specific repo information that accepts repoName as a parameter. 

const getRepoInfo = async function (repoName) {
	// make a fetch request to grab information about the specific repository
	const getInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
	// Declare a variable called repoInfo to resolve and save the JSON response
	const repoInfo = await getInfo.json();
	console.log(repoInfo);
	// Create a variable to grab the data from the language_url property of 'repoInfo'
	const fetchLanguages = await fetch(repoInfo.languages_url);
	// Create a variable to save the json response
	const languageData = await fetchLanguages.json();
	// Log out the data to check that you are returning the required results
	console.log(languageData);
	// Create an empty array called 'languages' ready to populate
	const languages = [];
	// Loop through the languageData object and add each language to the languages array
	for (const language in languageData) {
		languages.push(language);
		}
	// Log out the array to check
	console.log(languages);

	// call the function to display the repo info, pass it the repoInfo object and the languages array
	displayRepoInfo(repoInfo, languages);
};

// Create and name a new function to display the specific repo information. 
// The function should accept two parameters:  repoInfo and languages.
const displayRepoInfo = function (repoInfo, languages) {
	// empty the HTML of the section with a class of “repo-data”
	repoData.innerHTML = "";
	// Create a new div element
	const div = document.createElement("div");
	// Add the selected repository’s name, description, default branch, and link to its code on GitHub
	// Use the data acquired from the 'getRepoInfo' function above
	// Note: you want the url to the repo on github (not the repo's API address) - (html_url)
	div.innerHTML = `
	<h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`;

    // Append the new div element to the section with a class of "repo-data"
    repoData.append(div);
    // Unhide (show) the "repo-data element"
    repoData.classList.remove("hide");
    // Hide the element with the class of "repos"
    repoContainer.classList.add("hide");
}




