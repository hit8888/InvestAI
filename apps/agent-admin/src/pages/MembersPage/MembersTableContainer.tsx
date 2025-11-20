import { useMemo, useState, useEffect } from 'react';
import { UsersListResponse, UsersListQueryParams, User } from '@meaku/core/types/admin/api';
import useUsersListQuery from '../../queries/query/useUsersListQuery';
import UserModal from './components/UserModal';
import DeleteUserModal from './components/DeleteUserModal';
import MembersTable from './MembersTable';

const DEFAULT_PAGE_SIZE = 10;

interface MembersTableContainerProps {
  onCreateMemberClick?: (handler: () => void) => void;
}

const MembersTableContainer = ({ onCreateMemberClick }: MembersTableContainerProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const queryParams: UsersListQueryParams = useMemo(() => {
    const params: UsersListQueryParams = {
      page,
      page_size: pageSize,
    };

    return params;
  }, [page, pageSize]);

  const usersQuery = useUsersListQuery({ params: queryParams });

  // Expose the create handler to parent
  useEffect(() => {
    if (onCreateMemberClick) {
      onCreateMemberClick(() => setIsCreateModalOpen(true));
    }
  }, [onCreateMemberClick]);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    setPage(1);
  };

  const data: UsersListResponse['results'] = usersQuery.data?.results ?? [];

  return (
    <>
      <MembersTable
        data={data}
        totalRecords={usersQuery.data?.total_records ?? 0}
        page={page}
        pageSize={pageSize}
        isLoading={usersQuery.isLoading || usersQuery.isFetching}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onEditMember={(user) => setEditUser(user)}
        onDeleteMember={(user) => setDeleteUser(user)}
      />

      <UserModal mode="create" isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      <UserModal
        mode="edit"
        isOpen={editUser !== null}
        user={editUser ?? undefined}
        onClose={() => setEditUser(null)}
      />

      <DeleteUserModal
        isOpen={deleteUser !== null}
        user={deleteUser ?? undefined}
        onClose={() => setDeleteUser(null)}
      />
    </>
  );
};

export default MembersTableContainer;
