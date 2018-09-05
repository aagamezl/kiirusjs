import { Component } from './../../kiirus/core'

export class TemplateFor extends Component {

  constructor(attributes) {
    super({
      ...attributes,
      people: [{
        'id': 1,
        'firstName': 'Jack',
        'lastName': 'Vasquez',
        'email': 'jvasquez0@unblog.fr',
        'gender': 'Male',
        'ipAddress': '210.150.175.206'
      }]
    })
  }

  render() {
    return `
      <table class="table table-striped table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Ip Address</th>
          </tr>
        </thead>
        <tbody id="people">
          <tr data-for="person in people">
            <td data-click="select(person)">{person.id}</td>
            <td data-click="select(person.firstName)">{person.firstName}</td>
            <td data-click="select(person.lastName)">{person.lastName}</td>
            <td data-click="select(person.email)">{person.email}</td>
            <td data-click="select(person.gender)">{person.gender}</td>
            <td data-click="select(person.ipAddress)">{person.ipAddress}</td>
          </tr>
        </tbody>
      </table>
    `
  }
}
