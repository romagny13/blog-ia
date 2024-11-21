import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const BreadcrumbWrapper = styled.nav`
  padding: 10px 0;
`;

const BreadcrumbList = styled.ol`
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
`;
const BreadcrumbItem = styled.li`
  margin-right: 10px;
  &:not(:last-child):after {
    content: ">";
    margin-left: 10px;
  }

  ${(props) =>
    props.isActive &&
    `
      font-weight: bold;
      color: #555;
      pointer-events: none;
    `}
`;

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbItems = pathnames.map((value, index) => {
    const to = `/${pathnames.slice(0, index + 1).join("/")}`;
    return { to, label: value.charAt(0).toUpperCase() + value.slice(1) };
  });

  return (
    <BreadcrumbWrapper>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link to="/">Home</Link>
        </BreadcrumbItem>
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem
            key={index}
            isActive={index === breadcrumbItems.length - 1}
          >
            <Link to={item.to}>{item.label}</Link>
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </BreadcrumbWrapper>
  );
};

export default Breadcrumb;
