## bun acuma ca suntem aici vom folosi markdown 
** pentru ca ajuta la colorizare


@key -> 5fc7dc110794f700005c029106271d50

## When start the aplication will show the: Click here to authorize button, after that is pressed
## if the user If the account is in cache then the user can select the lists right away.
## else the user will get a popup where he will have to login with trello account and authorize
## After we get the token the user will see a dropdown where he can pick the lists to see his tasks



## authentification is made when the user clicks the button. 



## First we call our method AuthenticateTrello where we do the Trello authentification
## using Trello.authorize({..}).
## Once the authorization process is done we get Trello.token(). 


## After the user is logged in with trello account we can use 
## Trello.members.get("me", (member) => {})

## Now we have access to Trello.get("members/me/boards", (boards) =>{})
## This will give us all the boards that the user has.
## We dont have access to all the lists so we need to call Trello.get("/boards/"+board.id+"/lists")
## and add the lists to each board.

## Everytime the user selects another list we call the method -> _onSelect() 
## Here we call Trello.get("/lists/"+e.target.value+"/cards",  (cards) => {})
## and update the state in order to get the tasks for the selected list.



## For deauthorize we can use simply -> Trello.deauthorize();



TODO

1. add spinner for every API request
2. we need another way to deal with authorize