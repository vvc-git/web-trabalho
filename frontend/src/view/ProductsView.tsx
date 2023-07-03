/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Button, Cell, DataTable, Grid, Icon, Tooltip, VFlow } from "bold-ui";
import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { PageContainer } from "../components/PageContainer";
import api from "../api";
import { ProductType } from "../components/ModalOrder";
import { FormProducts } from "../components/FormProducts";

export function ProductsView() {
  const [products, setProducts] = useState<ProductType[] | undefined>([]);

  const executeQueryAllProducts = async () => {
    try {
      const response = await api.get("/queryAllProducts");
      const allProducts = response.data;
      setProducts(allProducts);
    } catch {}
  };

  useEffect(() => {
    executeQueryAllProducts();
  }, []);

  const handleRemoveClick = async (idProduct: string) => {
    try {
      await api.post("/removeProduct", {
        idProduct: idProduct,
      });
      executeQueryAllProducts();
    } catch {}
  };

  const renderLabel = (product: ProductType) => {
    return product.label;
  };

  const renderPrice = (product: ProductType) => {
    return Number(product.price).toFixed(2);
  };

  const renderButton = (product: ProductType) => {
    return (
      <div>
        <Tooltip text="Excluir">
          <Button
            size="small"
            skin="ghost"
            onClick={() => handleRemoveClick(product.value)}
          >
            <Icon icon="trashOutline" style={trachIconStyles} />
          </Button>
        </Tooltip>
      </div>
    );
  };

  return (
    <>
      <Header title="Produtos"></Header>
      <PageContainer>
        <VFlow>
          <Grid>
            <Cell xs={12} sm={12} md={12} lg={12}>
              <FormProducts update={executeQueryAllProducts}></FormProducts>
            </Cell>
            <Cell xs={12} sm={12} md={12} lg={12}>
              <div css={divTableStyles}>
                <DataTable<ProductType>
                  style={tableOrderStyles}
                  columns={[
                    {
                      header: "Produto",
                      name: "label",
                      render: renderLabel,
                    },
                    {
                      header: "Preço",
                      name: "price",
                      render: renderPrice,
                    },
                    {
                      name: "buttons",
                      render: renderButton,
                      style: {
                        textAlign: "right",
                        width: "150px",
                      },
                    },
                  ]}
                  hovered
                  rows={products}
                />
              </div>
            </Cell>
          </Grid>
        </VFlow>
      </PageContainer>
    </>
  );
}

const tableOrderStyles = css`
  font-size: 0.9rem !important;
  border: none;

  thead {
    background-color: #0069d0;
    color: white;
    height: 3.25rem;
  }

  thead span {
    cursor: auto;
  }
`;

const trachIconStyles = css`
  color: rgb(208, 30, 41) !important;
`;

const divTableStyles = css`
  overflow: auto;
  border: 1px solid #d3d4dd;
  border-radius: 0.375rem !important;
  border-bottom: none;
`;
