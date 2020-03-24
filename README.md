# Heroku-test

Test-projekt för att föra över databas till Heroku.

## Set-up heroku

1. Installera Heroku Cli https://devcenter.heroku.com/articles/heroku-cli
2. Kommandotolken: heroku login
3. Skriv in login-info
4. Clone git repository:
  - heroku git:clone -a <name of app>
  - cd <name of app> 
5. Deploy ändringar till heroku och git (måste göras varje gång ändringar skett)
  - git add .
  - git commit -m "message"
  - git push heroku master

### Skapa en MySQL databas i heroku och koppla

En MySQL-databas måste skapas i heroku. Det kräver ett addon och man måste koppla sitt bankkort till heroku för att få tillgång till det. 
Sedan skapar man en tabell i databasen (Har man redan en tabell i en annan databas kan man exportera den och kopiera dump-filen).

Följ denna instruktion:

https://bezkoder.com/deploy-node-js-app-heroku-cleardb-mysql/
