<img src="https://i.imgur.com/BkxShIO.jpeg" alt="validation-env Logo" width="200"/>
```
## Description

Manages the environment variables necessary for the application. Loads environment variables from the .env file and checks that all required variables are defined.

## Example

Add a list of variables that your application needs, when starting the class, it will check if all your variables exist, if not, an error will appear showing which variables should be added

## Install

```console
$ npm i validation-env
```

```js
import { EnvironmentManager } from 'validation-env';
const envList = ['API_KEY'];
const environmentManager = new EnvironmentManager(envList);
```

# Gets the value of an environment variable.

use static method of class EnvironmentManager

```js
const envList = ['API_KEY'];
const apiKey = EnvironmentManager.getValue('API_KEY');
```
