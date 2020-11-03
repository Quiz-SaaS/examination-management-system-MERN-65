import React, { useEffect } from "react";
import "./App.css";
import Login from "../logIn/Login";
import Signup from "../signUp/Signup";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ProtectedRoute from "../protectedRoute/ProtectedRoute";
import StudentDashboard from "../dashboard/Dashboard";
import TeacherDashboard from "../Teacher/Dashboard/Dashboard";
import AttemptTest from "../attemptTest/AttemptTest";
import Navbar from "../navbar";
import Result from "../result/ResultWrapper";
import TestInstruction from "../TestInstructions/TestInstruction";
import IndividualResult from "../result/ShowResult";
import TestPreviewWrapper from "../testPreview/TestPreviewWrapper";
import { connect } from "react-redux";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import Profile from "../profile/Profile";
import { Roles } from "../Roles/roles";
import CreateTest from "../Teacher/CreateTest/CreateTest";
import AssignedTestsWrapper from "../Teacher/AssigenedTest/AssignedTestsWrapper";
import TestStatus from "../Teacher/TestStatus/TestStatus";

function App(props) {
  // useEffect(() => {
  //  window.addEventListener('contextmenu',(e)=>{
  //   e.preventDefault();
  //  });
  //  window.addEventListener('keydown', (e)=>{
  //    console.log(e);
  //    if(e.key=="F12"){
  //     e.preventDefault();
  //    }
  //  })
  // }, []);

  const { selectedTestName, selectedAssignedTestName } = props;
  const role = props.userInfo.role;
  const { confirm } = Modal;
  const history = useHistory();

  const onLeaveComponent = () => {
    confirm({
      title: "Do you really want to quit the test?",
      icon: <ExclamationCircleOutlined />,
      content: "Once you click ok test will stop",
      onOk() {
        // console.log(props.selectedTest);
        console.log("OK");
        history.push("/");
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route exact={true} path={"/signin"} component={Login} />
          <Route exact={true} path="/signup" component={Signup} />
          <ProtectedRoute
            exact={true}
            path="/"
            component={
              Roles.teacher === role ? TeacherDashboard : StudentDashboard
            }
          />
          <ProtectedRoute
            exact={true}
            path="/attempt-test"
            component={AttemptTest}
          />
          <ProtectedRoute
            exact={true}
            path="/create-test"
            component={Roles.teacher === role ? CreateTest : AttemptTest}
          />
          <ProtectedRoute exact={true} path="/result" component={Result} />
          <ProtectedRoute
            exact={true}
            path={`/result/${selectedTestName}`}
            component={IndividualResult}
          />
          <ProtectedRoute
            exact={true}
            path="/test-instructions"
            component={TestInstruction}
          />
          <ProtectedRoute
            exact={true}
            path="/start-test"
            onLeave={onLeaveComponent}
            component={TestPreviewWrapper}
          />
          <ProtectedRoute exact={true} path="/profile" component={Profile} />
          <ProtectedRoute
            exact={true}
            path="/assigned-test"
            component={
              Roles.teacher === role ? AssignedTestsWrapper : StudentDashboard
            }
          />
          <ProtectedRoute
            exact={true}
            path={`/test-status/${selectedAssignedTestName}`}
            component={TestStatus}
          />
          <ProtectedRoute component={Login} />
        </Switch>
      </Router>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedTestName: state.selectedTest.selectedTestResultData.testName
      ?.replace(/\s+/g, "-")
      .toLowerCase(),
    userInfo: state.auth.user,
    selectedAssignedTestName: state.selectedTest.selectedAssignedTestData.testName
      ?.replace(/\s+/g, "-")
      .toLowerCase(),
  };
};

export default connect(mapStateToProps, null)(App);
