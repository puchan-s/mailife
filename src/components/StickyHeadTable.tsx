'use client'

import Checkbox from '@mui/material/Checkbox'
import Paper from '@mui/material/Paper'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import { Pagination } from '@mui/material'
import Table from '@mui/material/Table'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button';
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

const Root = styled(Paper)`
  width: 100%;
  overflow-x: auto;
  transform: rotateX(180deg);
`;

const Content = styled(Table)`
  transform: rotateX(180deg);
`;

const StickyHeader = styled(TableCell)`
  position: sticky;
  left: 0;
  z-index: 1;
  background-color: #fff;
`;

const Cell = styled(TableCell)`
  min-width: 400px;
`;

const RoundedPaginationItem = styled(Pagination)`
  & .MuiButtonBase-root {
    border-radius: 50% !important;
  }
`;

const MenuItem = styled.div`
  & .MuiButtonBase-root {
    padding: 10px 0 !important;
  }
`;

const handleClick = () => {
    alert('Button clicked!');
  };

type Props = {
    headers:{name:string}[],
    rows: object[]
}

const StickyHeadTable: React.FC<Props> = ({ headers ,rows }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = useCallback((event: unknown, newPage: number) => {
        setPage(newPage - 1)
    }, [])

    const handleChangeTablePage = useCallback((event: unknown, newPage: number) => {
        setPage(newPage)
    }, [])

    const handleChangeRowsPerPage = useCallback((
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setRowsPerPage(Number(event.target.value))
        setPage(0)
    }, [])

    return (
        <>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                labelRowsPerPage="1ページあたりの表示数"
                page={page}
                onPageChange={handleChangeTablePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={() => (
                    <RoundedPaginationItem
                        count={Math.ceil(rows.length / rowsPerPage)}
                        page={page + 1}
                        onChange={handleChangePage}
                        showFirstButton
                        showLastButton
                        color="primary"
                        sx={{ ml: '10px', width: '100%' }}
                    />
                )}
                slotProps={{
                    select: {
                        MenuProps: {
                            MenuListProps: {
                                sx: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                },
                                classes: { root: MenuItem },
                            },
                        },
                    },
                }}
            />
            <Root>
                <TableContainer>
                    <Content
                        stickyHeader
                        aria-label="sticky table"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                {headers
                                .map((header,idx) => (
                                    <TableCell align="left" key={idx} >{header.name}</TableCell>
                                ))}
                                <TableCell align="left"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row,idx) => (
                                    <TableRow
                                        key={idx}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <StickyHeader component="th" scope="row">
                                            <Checkbox />
                                        </StickyHeader>
                                        {Object.entries(row).map(([key, value]) => (
                                            <Cell component="th" scope="row" key={key}>
                                                {value}
                                            </Cell>
                                         ))}
                                        <Cell component="th" scope="row"  align="left">
                                            <Button variant="contained" color="primary" onClick={handleClick}>
                                                詳細
                                            </Button>
                                        </Cell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Content>
                </TableContainer>
            </Root>
        </>
    )
}

export default StickyHeadTable
