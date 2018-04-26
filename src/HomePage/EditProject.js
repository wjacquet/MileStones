import React, {Component} from 'react';

import {Button, Modal, ModalBody, ModalHeader, ModalFooter} from 'mdbreact';
import {Row, Col} from 'reactstrap';

import axios from 'axios';
import Checkbox from 'material-ui/Checkbox';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import MileStoneCompleted from './MileStoneCompleted';

class EditProject extends Component {

  constructor(props) {
    super(props);

    this.state = {
      updatedProject: {},
      checked: false,
    }
  }

  updateProject = (milestone) => {
    let project = []
    // console.log(this.props.editProject)
    for (let i in this.props.editProject.mileStones) {
      let id = this.props.editProject.mileStones[i].id
      if (milestone.id === id) {
        let tempMile = this.props.editProject.mileStones
        project = tempMile
        tempMile[i] = milestone

        let newProject = {
          'user': {
              'id': this.props.user.id,
              'name': this.props.user.name
          },
          'project': {
              'name': this.props.editProject.name,
              'dueDate': this.props.editProject.dueDate,
              'completed': false,
              'hidden': this.state.checked,
              'id': this.props.editProject.id, 
              'mileStones': tempMile,
          }
        }
        this.setState({updatedProject: newProject}, () => {
          let completed = false
          completed = this.checkIfAllCompleted(this.props.editProject.mileStones)

          if (completed) {
            let newProject = {
              'user': {
                  'id': this.props.user.id,
                  'name': this.props.user.name
              },
              'project': {
                  'name': this.props.editProject.name,
                  'dueDate': this.props.editProject.dueDate,
                  'completed': true,
                  'id': this.props.editProject.id,
                  'hidden': this.state.checked,
                  // Possible Race Condition
                  'mileStones': this.props.editProject.mileStones,
              }
            }
            this.setState({updatedProject: newProject}, () => {return})
          } else {
            let newProject = {
              'user': {
                  'id': this.props.user.id,
                  'name': this.props.user.name
              },
              'project': {
                  'name': this.props.editProject.name,
                  'dueDate': this.props.editProject.dueDate,
                  'completed': false,
                  'id': this.props.editProject.id,
                  'hidden': this.state.checked,
                  // Possible Race Condition
                  'mileStones': this.props.editProject.mileStones,
              }
            }
            this.setState({updatedProject: newProject}, () => {return})
          }
        })
      }
    }
  
    let completed = false
    completed = this.checkIfAllCompleted(this.props.editProject.mileStones)
  
    
    if (completed) {
      let newProject = {
        'user': {
            'id': this.props.user.id,
            'name': this.props.user.name
        },
        'project': {
            'name': this.props.editProject.name,
            'dueDate': this.props.editProject.dueDate,
            'completed': true,
            'id': this.props.editProject.id,
            'hidden': this.state.checked,
            // Possible Race Condition
            'mileStones': this.props.editProject.mileStones,
        }
      }
      this.setState({updatedProject: newProject})
    } else {
      let newProject = {
        'user': {
            'id': this.props.user.id,
            'name': this.props.user.name
        },
        'project': {
            'name': this.props.editProject.name,
            'dueDate': this.props.editProject.dueDate,
            'completed': false,
            'id': this.props.editProject.id,
            'hidden': this.state.checked,
            // Possible Race Condition
            'mileStones': this.props.editProject.mileStones,
        }
      }
      this.setState({updatedProject: newProject})
    }
  }

  checkIfAllCompleted = (milestones) => {
    let completed = false
    for (let j in milestones) {
      if (milestones[j].completed === true) completed = true
      else return false
    }
    return true
  }

  sendUpdatedProject = () => {
    console.log(this.state.updatedProject)
    axios.put('http://localhost:5000/users/projects/update', this.state.updatedProject).then((response) => {
      let self = this;
          axios.get(`http://localhost:5000/users/${this.props.user.id}`)
            .then((response) => {
              let respData = response.data.user
              self.setState({checked: false});
              self.props.updateUserHome(respData)
              self.props.toggleEditProject()
            })
            .catch((error) => {
              console.log(error);
            });
    }).catch((error) => {
        console.log(error.message)
    });
  }

  handleCheck = () => {
    this.setState({checked: !this.state.checked}, () => {
      let temp = this.props.editProject
      temp.hidden = !this.state.checked
      this.updateProject(temp)
    })
  }

  render() {
      return (
        <div>
          <Modal backdrop={false} isOpen={this.props.editProjectModal} toggle={this.toggleEditProject}>
            <ModalHeader toggle={this.toggleEditProject}>Edit {this.props.editProject.name} {'  '}        
            </ModalHeader>
            <ModalBody>

              {this.props.editProject.mileStones.map((value, index) => {
                return (
                  <MileStoneCompleted updateProject={this.updateProject} data={value} key={value.id}/>
                )
              })}

              <Row>
                <Col xs='7'/>
                <Col xs='5'>
                  <MuiThemeProvider>
                    <Checkbox
                      checked={this.state.checked}
                      onCheck={this.handleCheck}
                      label='Hide Project'
                    />
                </MuiThemeProvider>
                </Col>
              </Row>

            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.props.toggleEditProject}>Close</Button>{' '}
              <Button onClick={this.sendUpdatedProject} color="primary">Save</Button>
            </ModalFooter>
          </Modal>
          
        </div>
      );
    }
}

export default EditProject;
