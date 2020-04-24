import React, { Component } from "react";
import AceEditor from "react-ace";

import { Button, Spin } from "antd";
import { Select, notification } from "antd";
import { Row, Col } from "antd";

import "./App.css";

import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";

import "ace-builds/src-noconflict/theme-monokai";

import "brace/ext/language_tools";

import Axios from "axios";
// http://localhost:8000/
// https://enigmatic-brook-34827.herokuapp.com/

let prod = true;
const { Option } = Select;

const axinst = Axios.create({
  baseURL: prod
    ? "https://enigmatic-brook-34827.herokuapp.com/"
    : "http://localhost:8000/",
  timeout: 15000,
});

export default class App extends Component {
  openNotificationWithIcon = () => {
    notification["error"]({
      message: "An error occured",
      description:
        this.state.stdin === ""
          ? "The server took too long to respond."
          : "Make sure the input doesn't contain unneccary data.",
    });
  };

  state = {
    modes: [
      {
        name: "Python",
        value: "python",
        defaultCode: `print("Hello, World!")`,
      },
      {
        name: "C/C++",
        value: "c_cpp",
        defaultCode: `#include <stdio.h>
      int main() {
         printf("Hello, World!");
         return 0;
      }`,
      },
      {
        name: "Java",
        value: "java",
        defaultCode: `public class Simple{  
        public static void main(String args[]){  
         System.out.println("Hello, World!");  
        }  
    }  `,
      },
      {
        name: "JavaScript",
        value: "javascript",
        defaultCode: `console.log( 'Hello, World!' );`,
      },
    ],
    selectedMode: 0,
    loading: false,
  };

  onChange = (value, selectedMode) => {
    let obj = this.state.modes;
    obj[selectedMode].defaultCode = value;
  };

  handleChange = (value) => {
    console.log(value);
  };

  runCode = () => {
    this.setState({
      stdout: "",
      exitcode: "",
      memoryUsage: "",
      cpuUsage: "",
      stderr: "",
      loading: true,
    });
    let code = this.state.modes[this.state.selectedMode].defaultCode;
    axinst
      .post("/runcode", {
        code,
        selectedMode: this.state.selectedMode,
        stdin: this.state.stdin,
      })
      .then(({ data }) => {
        console.log(data);
        if (data.stderr === "") {
          this.setState({
            stdout: data.stdout,
            stderr: data.stderr,
            exitcode: data.exitCode,
            memoryUsage: data.memoryUsage,
            cpuUsage: data.cpuUsage,
            errorType: data.errorType,
            loading: false,
          });
        } else {
          this.setState({
            stdout: data.stderr,
            stderr: data.stderr,
            exitcode: data.exitCode,
            memoryUsage: data.memoryUsage,
            cpuUsage: data.cpuUsage,
            errorType: data.errorType,
            loading: false,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
        this.openNotificationWithIcon();
      });
  };

  render() {
    return (
      <div>
        <Row >
          <Col span={24}>
            <Select
              defaultValue={this.state.modes[this.state.selectedMode].name}
              style={{ width: 120 }}
              onChange={(value) => this.setState({ selectedMode: value })}
            >
              {this.state.modes.map((mode, ind) => {
                return (
                  <Option key={ind} value={ind}>
                    {mode.name}
                  </Option>
                );
              })}
            </Select>
          </Col>
        </Row>

        <Row  justify="center">
          <Col  span={10}>
            {" "}
            <AceEditor
              placeholder="Online IDE developed by Sibi Sharanyan"
              mode={this.state.modes[this.state.selectedMode].value}
              theme="monokai"
              name="blah2"
              onLoad={this.onLoad}
              onChange={(value) =>
                this.onChange(value, this.state.selectedMode)
              }
              fontSize={14}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              value={this.state.modes[this.state.selectedMode].defaultCode}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
              }}
            />
          </Col>

          <Col span={6}>
            <Row>
              <Col span={24}>
                <div className="form-group">
                  <label htmlFor="exampleFormControlTextarea1">
                    Enter input
                  </label>
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="7"
                    value={this.state.stdin}
                    onChange={(e) => this.setState({ stdin: e.target.value })}
                  ></textarea>
                </div>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <div className="form-group">
                  <label htmlFor="exampleFormControlTextarea2">Output</label>
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea2"
                    rows="7"
                    value={this.state.stdout}
                    readOnly
                  ></textarea>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row>
          <Col span={6}>
            <Button
              disabled={this.state.loading}
              onClick={() => this.runCode()}
              type="primary"
            >
              Compile and Run
            </Button>
          </Col>

          <Col span={6}>
            <Spin className="mt-2" spinning={this.state.loading} />
          </Col>
        </Row>

        <Row justify="center">
         
        <Col span={5}>
              <p className="lead">Made by Sibi Sharanyan</p>
             </Col>

          <Col span={1}>
            <a style = {{color: "black"}} href="https://github.com/sibi-sharanyan">

            <i class="fab fa-github fa-2x"></i>

            </a>
             </Col>

             <Col span={1}>
            <a style = {{color: "black"}} href="https://www.linkedin.com/in/sibi-sharanyan">

            <i class="fab fa-linkedin fa-2x"></i>

            </a>
             </Col>

             <Col span={1}>
            <a style = {{color: "black"}} href="mailto:sibisharanyanit@gmail.com">

            <i class="fas fa-envelope fa-2x"></i>

            </a>
             </Col>



        </Row>

      </div>
    );
  }
}
