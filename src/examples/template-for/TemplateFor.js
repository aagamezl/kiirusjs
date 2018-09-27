import { Component, Http } from './../../kiirus/core'

export class TemplateFor extends Component {

  constructor(props) {
    // super({
    //   ...props,
    //   people: [{
    //     'id': 1,
    //     'firstName': 'Jack',
    //     'lastName': 'Vasquez',
    //     'email': 'jvasquez0@unblog.fr',
    //     'gender': 'Male',
    //     'ipAddress': '210.150.175.206'
    //   }, {
    //     'id': 2,
    //     'firstName': 'John',
    //     'lastName': 'Vasquez',
    //     'email': 'jvasquez0@unblog.fr',
    //     'gender': 'Male',
    //     'ipAddress': '210.150.175.206'
    //   }]
    // })
    super(props)

    this.state = {
      people: [],
      show: false,
    }

    setTimeout(() => {
      this.setState({
        show: !this.state.show
      })
    }, 2000)
  }

  connectedCallback () {
    Http.get('./public/mock-data.json', { responseType: 'json' })
      .then((people) => {
        this.setState({
          people
        })
      })
  }

  render() {
    return `
      <div>
        <style>
          .table-bordered {
            border: 1px solid #ddd;
          }
          .table {
            margin-bottom: 20px;
            max-width: 100%;
            width: 100%;
          }
          .table-striped>tbody>tr:nth-of-type(odd) {
            background-color: #f9f9f9;
          }
          .table-bordered>tbody>tr>td,
          .table>thead>tr>th {
            border: 1px solid #ddd;
            line-height: 1.42857143;
            padding: 8px;
            vertical-align: top;
          }
          .table-bordered>thead>tr>th {
            border: 1px solid #ddd;
          }
          table {
            display: flex;
            flex-flow: column;
            height: 85vh;
            width: 100%;
            border-spacing: 0;
            border-collapse: collapse;
          }
          table thead {
            /* head takes the height it requires, 
            and it's not scaled when table is resized */
            flex: 0 0 auto;
            width: calc(100% - 1.1em);
            /* width: 100%; */
          }
          table tbody {
            /* body takes all the remaining available space */
            flex: 1 1 auto;
            display: block;
            overflow-y: auto;
            /* width: calc(100% - 17px); */
          }
          table tbody tr {
            width: 100%;
          }
          table thead, table tbody tr {
            display: table;
            table-layout: fixed;
          }
        </style>
        <div data-if="this.state.show === true">
          <span>This is a conditional message</span>
        </div>
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
            <tr data-for="person in this.state.people">
              <td data-click="select(person)">{person.id}</td>
              <td data-click="select(person.firstName)">{person.firstName}</td>
              <td data-click="select(person.lastName)">{person.lastName}</td>
              <td data-click="select(person.email)">{person.email}</td>
              <td data-click="select(person.gender)">{person.gender}</td>
              <td data-click="select(person.ipAddress)">{person.ipAddress}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  }
}
