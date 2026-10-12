import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePolicies } from "../../../hooks/usePolicies";
import { usePolicySync } from "../../../hooks/usePolicySync";
import { SyncMessageContainer } from "../../../styles/admin/SyncMessage.styled";
import {
  PageContainer,
  PageHeader,
  ButtonGroup,
  Button,
  TableContainer,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  SingleLineTableCell,
  StatusBadge,
  DeleteButton,
} from "../../../styles/admin/Policies.styled";

const Policies: React.FC = () => {
  const navigate = useNavigate();
  const [deleteMode, setDeleteMode] = useState(false);
  const { policies, loading, error, deletePolicy } = usePolicies();
  const { syncLoading, syncMessage, handleRunBatchJob } = usePolicySync();

  const handleAddPolicy = () => navigate("/admin/policies/create");
  const handleDeleteModeToggle = () => setDeleteMode(!deleteMode);

  const handleRowClick = (policy_id: string) => {
    if (!deleteMode) {
      navigate(`/admin/policies/${policy_id}`);
    }
  };

  const getFirstLine = (str: string) => (str ? str.split(/\r?\n/)[0] : "");

  if (loading) return <PageContainer>Loading...</PageContainer>;
  if (error) return <PageContainer>{error}</PageContainer>;

  return (
    <PageContainer>
      <PageHeader>
        <br />
        {syncMessage && (
          <SyncMessageContainer isError={syncMessage.startsWith("Error")}>
            {syncMessage}
          </SyncMessageContainer>
        )}
        <ButtonGroup>
          <Button onClick={handleAddPolicy}>Add</Button>
          <Button $variant="danger" onClick={handleDeleteModeToggle}>
            {deleteMode ? "Cancel" : "Delete"}
          </Button>
          <Button onClick={handleRunBatchJob} disabled={syncLoading}>
            {syncLoading ? "Running..." : "Run Batch Job"}
          </Button>
        </ButtonGroup>
      </PageHeader>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>Policy ID</TableHeader>
              <TableHeader>Customer ID</TableHeader>
              <TableHeader>Product ID</TableHeader>
              <TableHeader>Employee ID</TableHeader>
              <TableHeader>Start Date</TableHeader>
              <TableHeader>End Date</TableHeader>
              <TableHeader>Details</TableHeader>
              <TableHeader>Status</TableHeader>
              {deleteMode && <TableHeader>Action</TableHeader>}
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <TableRow
                key={policy.policy_id}
                onClick={() => handleRowClick(policy.policy_id)}
                style={{ cursor: deleteMode ? "default" : "pointer" }}
              >
                <TableCell>{policy.policy_id}</TableCell>
                <TableCell>{policy.customer_id}</TableCell>
                <TableCell>{policy.product_id}</TableCell>
                <TableCell>{policy.employee_id}</TableCell>
                <TableCell>{policy.start_date.split("+")[0]}</TableCell>
                <TableCell>{policy.end_date.split("+")[0]}</TableCell>
                <SingleLineTableCell>
                  {getFirstLine(policy.policy_details)}
                </SingleLineTableCell>
                <TableCell>
                  <StatusBadge
                    status={policy.status === "Active" ? "Active" : "Inactive"}
                  >
                    {policy.status}
                  </StatusBadge>
                </TableCell>
                {deleteMode && (
                  <TableCell>
                    <DeleteButton
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePolicy(policy.policy_id);
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 4H3.33333H14"
                          stroke="#EF4444"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5.33334 4V2.66667C5.33334 2.31305 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31305 1.33334 6.66668 1.33334H9.33334C9.68697 1.33334 10.0261 1.47381 10.2762 1.72386C10.5262 1.97391 10.6667 2.31305 10.6667 2.66667V4M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2762 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66668C4.31305 14.6667 3.97392 14.5262 3.72387 14.2761C3.47382 14.0261 3.33334 13.687 3.33334 13.3333V4H12.6667Z"
                          stroke="#EF4444"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </DeleteButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
};

export default Policies;
