import { ChevronRightIcon } from "@chakra-ui/icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";

interface BreadscrumbListProps {
  breadCrumbList: string[];
  onBreadCrumbClick: () => void;
}

const BreadscrumbList = ({
  breadCrumbList,
  onBreadCrumbClick,
}: BreadscrumbListProps) => {
  return (
    <Breadcrumb
      spacing="8px"
      separator={<ChevronRightIcon color="gray.500" />}
      fontSize="sm"
    >
      {breadCrumbList.map((breadCrumb) => {
        if (breadCrumb === "서울시") {
          return (
            <BreadcrumbItem
              key={breadCrumb}
              onClick={() => onBreadCrumbClick()}
            >
              <BreadcrumbLink>{breadCrumb}</BreadcrumbLink>
            </BreadcrumbItem>
          );
        }
        return (
          <BreadcrumbItem key={breadCrumb}>
            <BreadcrumbLink>{breadCrumb}</BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
};

export default BreadscrumbList;
