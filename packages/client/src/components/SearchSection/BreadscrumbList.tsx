import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
} from '@chakra-ui/react';

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
      {breadCrumbList.map(breadCrumb => {
        if (breadCrumb === '서울시') {
          return (
            <BreadcrumbItem key={breadCrumb} onClick={onBreadCrumbClick}>
              <BreadcrumbLink>
                <Text fontSize="sm" fontWeight="900">
                  {breadCrumb}
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
          );
        }
        return (
          <BreadcrumbItem key={breadCrumb}>
            <BreadcrumbLink>
              <Text fontSize="sm" fontWeight="900">
                {breadCrumb}
              </Text>
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
};

export default BreadscrumbList;
