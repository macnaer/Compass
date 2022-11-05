import * as Yup from "yup";

export const ChangeProfileSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Required")
    .label("Email address"),
  name: Yup.string().required("Name is required").label("Name"),
  surname: Yup.string().required("Surname is required").label("Surname"),
  phone: Yup.string().required("Phone is required").label("Phone"),
  role: Yup.string().required("Role is required.").label("Role"),
});
