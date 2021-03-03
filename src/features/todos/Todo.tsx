import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as yup from "yup";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  List,
  Checkbox,
  Typography,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import {
  addNewTodo,
  deleteTodo,
  fetchTodos,
  selectAllTodos,
  TodoState,
  updateTodo,
} from "./todoSlice";
import { useFormik } from "formik";

const validationSchema = yup.object().shape({
  title: yup.string().max(10, "Title is too long").required(),
});

export function Todo() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const todos: TodoState[] = useSelector(selectAllTodos);

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema,
    initialValues: {
      id: 0,
      title: "",
      completed: false,
    },
    onReset: () => {
      form.resetFields();
    },
    onSubmit: (values: TodoState, { resetForm }) => {
      dispatch(addNewTodo(values));
      resetForm();
    },
  });

  return (
    <Row justify="center">
      <Col span={8}>
        <Row>
          <Form form={form} layout="inline">
            <Form.Item
              name="title"
              // validateStatus={formik.errors.title ? "error" : "validating"}
              // rules={[
              //   { required: true, message: "Please input your title!" },
              //   { max: 10, message: "Title is too long" },
              // ]}
            >
              <Input
                onChange={formik.handleChange}
                value={formik.values.title}
              />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                onClick={() => formik.handleSubmit()}
              >
                Add
              </Button>
            </Form.Item>
          </Form>
        </Row>
        <Row
          style={{
            marginTop: "20px",
          }}
        >
          <List
            style={{
              width: "100%",
            }}
            size="large"
            bordered
            itemLayout="horizontal"
            dataSource={todos}
            renderItem={(item) => (
              <List.Item
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "end",
                }}
              >
                <Checkbox
                  onClick={() => {
                    dispatch(updateTodo(item));
                  }}
                />
                <Typography>{item.title}</Typography>
                <Typography>{item.completed}</Typography>
                <Button type="primary">
                  <DeleteOutlined
                    color="red"
                    onClick={() => {
                      dispatch(deleteTodo(item.id!));
                    }}
                  />
                </Button>
              </List.Item>
            )}
          />
        </Row>
      </Col>
    </Row>
  );
}
