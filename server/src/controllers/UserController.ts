import { Request, Response } from "express";
import { Citi, Crud } from "../global";

class UserController implements Crud {
  constructor(private readonly citi = new Citi("User")) {}
  create = async (request: Request, response: Response) => {
    const { firstName, lastName, age } = request.body;

    const isAnyUndefined = this.citi.areValuesUndefined(
      firstName,
      lastName,
      age
    );
    if (isAnyUndefined) return response.status(400).send();

    const newUser = { firstName, lastName, age };
    const { httpStatus, message } = await this.citi.insertIntoDatabase(newUser);

    return response.status(httpStatus).send({ message });
  };

  get = async (request: Request, response: Response) => {
    const { httpStatus, values } = await this.citi.getAll();

    return response.status(httpStatus).send(values);
  };

  // função que filtra usuários com idade inferior à idade fornecida no get
  getById = async (request: Request, response: Response) => {
    const { age } = request.params;
    const { httpStatus, values } = await this.citi.getAll();

    const valueToReturn = values.filter(value => value.age < Number(age));

    if (valueToReturn.length === 0) return response.status(httpStatus).send('Não há pessoas usuárias para o filtro escolhido');

    return response.status(httpStatus).send(valueToReturn);
  };

  // função que calcula e retorna a média de idade dos usuários
  averageAge = async (request: Request, response: Response) => {
    const { httpStatus, values } = await this.citi.getAll();

    const ageSum = values.reduce((accumulate, value) => {
      return accumulate + value.age
    }, 0);
    const numberOfPeople = values.length

    const average = ageSum / numberOfPeople;

    return response.status(httpStatus).send({ averageAge: average });
  };

  // função que filtra usuários pelo sobrenome fornecido no get
  getByLastName = async (request: Request, response: Response) => {
    const { lastName } = request.params;
    const { httpStatus, values } = await this.citi.getAll();

    const filteredUsers = values.filter((user) => user.lastName.toLowerCase() === lastName.toLowerCase());

    if (filteredUsers.length === 0) return response.status(httpStatus).send(`Nenhum usuário encontrado com o sobrenome "${lastName}"`);

    return response.status(httpStatus).send(filteredUsers);
  };

  delete = async (request: Request, response: Response) => {
    const { id } = request.params;

    const { httpStatus, messageFromDelete } = await this.citi.deleteValue(id);

    return response.status(httpStatus).send({ messageFromDelete });
  };

  update = async (request: Request, response: Response) => {
    const { id } = request.params;
    const { firstName, lastName, age } = request.body;

    const updatedValues = { firstName, lastName, age };

    const { httpStatus, messageFromUpdate } = await this.citi.updateValue(
      id,
      updatedValues
    );

    return response.status(httpStatus).send({ messageFromUpdate });
  };
}

export default new UserController();
