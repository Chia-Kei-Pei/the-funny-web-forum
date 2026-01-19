# the funny 🤣 #
Created by Chia Kei Pei.

## Tutorials used ###
1. [TypeScript: Handbook - The TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
2. [A Tour of Go](https://go.dev/tour/list)
3. [Go and React Full Stack App – Go Tutorial for Node Developers](https://www.youtube.com/watch?v=lNd7XlXwlho) - By freeCodeCamp.org on YouTube.
4. [PostgreSQL and Go (Golang): Setup, CRUD Examples, and Connection Guide](https://www.w3resource.com/PostgreSQL/snippets/postgresql-golang-guide.php) by w3resource.com
5. [Chakra-UI Documentation](https://www.chakra-ui.com/docs/get-started/installation]
6. [How-to Fix Blocked aria-hidden on an element because its descendant retained focus](https://www.rankya.com/how-to/fix-blocked-aria-hidden-on-an-element-because-its-descendant-retained-focus/)
7. [Basic writing and formatting syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#links)

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

From all these AI assistance, none of them wrote code directly into my project. I believe I have not commited plagarism in this.