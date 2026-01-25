# the funny 🤣 #
Created by Chia Kei Pei.

## How to setup ##
1. Run `git clone https://github.com/Chia-Kei-Pei/the-funny-web-forum/tree/main`
2. Open VS Code IDE (optional)
3. Install the dependencies if don't have (optional? I think this project already contains the downloaded libraries.):
    - `npm i @tanstack/react-query @tanstack/react-router @tanstack/react-router-devtools`
    - `npm i --save-dev @tanstack/router-plugin `
    - `npm i @chakra-ui/react`
4. In one terminal, go to `~/the-funny-web-forum/client/` and run `npm run dev`
5. In another terminal, go to `~/the-funny-web-forum` and run `air`
6. Open `http://localhost:5173` on a browser.
7. Enjoy my web app.

## Tutorials used ###
1. [TypeScript: Handbook - The TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
2. [A Tour of Go](https://go.dev/tour/list)
3. [Go and React Full Stack App – Go Tutorial for Node Developers](https://www.youtube.com/watch?v=lNd7XlXwlho) - By freeCodeCamp.org on YouTube.
4. [PostgreSQL and Go (Golang): Setup, CRUD Examples, and Connection Guide](https://www.w3resource.com/PostgreSQL/snippets/postgresql-golang-guide.php) by w3resource.com
5. [Chakra-UI Documentation](https://www.chakra-ui.com/docs/get-started/installation)
6. [How-to Fix Blocked aria-hidden on an element because its descendant retained focus](https://www.rankya.com/how-to/fix-blocked-aria-hidden-on-an-element-because-its-descendant-retained-focus/)
7. [Basic writing and formatting syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#links)
8. [Complete TanStack Router Tutorial - Build Type-Safe React Apps with File-Based Routing](https://www.youtube.com/watch?v=WyqxZniJk5w)
9. [Dynamic nested routes using TanStack Router](https://stackoverflow.com/questions/79220915/dynamic-nested-routes-using-tanstack-router)
10. [Navigating Programmatically with TanStack Router while Preserving Type Safety](https://borstch.com/snippet/navigating-programmatically-with-tanstack-router-while-preserving-type-safety)
11. [TanStack Start Authentication with Supabase](https://www.youtube.com/watch?v=6c8kuvBolQg) - [Github repo for this tutorial](https://github.com/Balastrong/confhub/tree/dc79c9f8fd2a4fb621e2b7029bb0e8dd202d6eb6)

## AI Declaration ##
I **did** use AI to assist in solving a few bugs. Here is a list of those cases.

1. In main.go, there was a error relating to fetching the database. Phind AI suggested turning my walrus operator ":=" into a normal assignment operator "=".

```
// BEFORE
// postgres database
	db, err := sql.Open("postgres", POSTGRES_CRED)

// AFTER
// postgres database
	db, err = sql.Open("postgres", POSTGRES_CRED)
```

Basically I tried to declare the db as a global variable, but the walrus operator was assigning db as a local variable in the main function, so db was null in the other functions.

2. In TopicFormDialog.tsx or some previous version of it (now deleted), I tried to figure out why the input.focus() code was not working. 

```
// BEFORE
return (
    <Input
      placeholder="Title"
      type="text"
      value={newTopic}
      onChange={(e) => setNewTopic(e.target.value)}
      ref={(input) => input && input.focus()}
    />
  );
```

Phind AI suggested this solution
```
return (
    <Input
      placeholder="Title"
      type="text"
      value={newTopic}
      onChange={(e) => setNewTopic(e.target.value)}
      ref={(input) => {
        if (input) {
          input.focus();
        }
      }}
    />
  );
```

I settled on this solution
```
return (
    <Input
      placeholder="Title"
      type="text"
      value={newTopic}
      onChange={(e) => setNewTopic(e.target.value)}
      ref={(input) => input?.focus()}}
    />
  );

```

But eventually, this code was removed.

3. Before settling on Chakra-UI, I was experimenting with Daisy-UI, with used Tailwind css. Got a strange error I didn't understand. Gave the error to Phind AI. It said the error is noting a stray backtick "`" somewhere. I found the stray backtick and removed it, then my code worked. Eventually didn't use Daisy-UI

4. Something about Bodyparser not parsing correctly. I forgot my prompt.

5. Got an error message in the browser complaining about aria-hidden being set to true on a hidden element. I asked Google Gemini twice to help solve the problem. Its answer didn't work. Found the solution on a website (see index.css). Didn't end up using Gemini's solutions in the end.

6. Asked Duck.ai (from DuckDuckGo) what is prefetching, preloading and pending in TanStack Router? Then it explained to me that those are about handling data and loading in a web app.

7. Duck.ai again. I was trying to use GoLang to query a row from my Postgresql database, but it kept having an error "pq: got 1 parameters but the statement requires 0". Passed in the function code of getTopic() in main.go. I went back and forth with Duck.ai. None of its solutions seemed to work. Eventually found that error was not in main.go function, but with an unnecessary try-catch block in $topic.tsx loader argument. See `duck.ai_2026-01-24_09-21-12.txt` for full chat.

I did not use an AI which wrote code directly into the project and did not blindly use AI output wholesale. I believe I have not commited plagarism in this.
