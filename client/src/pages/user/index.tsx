import ReusableTable from "@/components/reusable-table";
import Container from "@/components/container";
import Title from "@/components/ui/title";
import NavContainer from "@/components/nav-container";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useFetchAndDispatch } from "@/helpers/useFetch";
import Breadcrumb from "@/components/bread-crumb";
import { getAllUser } from "@/api/get.info.api";
import { useAuth } from "@/stores/AuthContext";

const UserHome = () => {
  const { allUser, user } = useAuth();
  useFetchAndDispatch(getAllUser, "GET_ALL_USER");

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "ID", accessor: "userId" },
    { header: "Email", accessor: "email" },
    { header: "Account Status", accessor: "status" },
  ];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Users", isCurrentPage: true },
  ];

  const navigate = useNavigate();

  return (
    <Container>
      <Breadcrumb items={breadcrumbItems} />
      <ReusableTable
        tableHeader={
          <NavContainer>
            <Title text="List of Students" />
            <Button onClick={() => navigate("new")}>Create User</Button>
          </NavContainer>
        }
        data={allUser
          .filter((x) => x.role !== "admin" && x.isDeleted === false)
          .map((item) => {
            return {
              ...item,
              name:
                item.personalData?.firstName +
                " " +
                item.personalData?.lastName,
              status: (item as any)?.socketId ? "Online" : "Offline",
            };
          })}
        columns={columns as any}
        onEdit={(item) =>
          navigate(`/users/new?=${item?._id}`, { state: { isEdit: true } })
        }
        onView={(item) =>
          navigate(
            `/users/new?=${item?._id}${
              user.role !== "user" ? "" : "/progress"
            }`,
            { state: { isEdit: true } }
          )
        }
        title="Users"
      />
    </Container>
  );
};

export default UserHome;
