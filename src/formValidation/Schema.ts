import * as Yup from "yup";

const Schema = Yup.object().shape({
  name: Yup.string()
    .min(4, "Too Short")
    .max(50, "Too Long")
    .required("Required"),
  description: Yup.string()
    .min(5, "Too Short")
    .max(200, "Too Long")
    .required("Required"),
  priority: Yup.string().required("Priority is required"),
  dueDate: Yup.string().optional(),
});

export default Schema;
