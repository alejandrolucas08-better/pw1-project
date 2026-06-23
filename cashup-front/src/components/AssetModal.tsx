import React, { useState } from "react";
import { Modal, Form, Button, Alert, Spinner } from "react-bootstrap";
import { DollarSign, Hash, Layers } from "lucide-react";
import { request } from "../services/httpClient";

interface AssetModalProps {
  show: boolean;
  handleClose: () => void;
  onSuccess: () => void;
}

export const AssetModal: React.FC<AssetModalProps> = ({ show, handleClose, onSuccess }) => {
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const clearForm = () => {
    setTicker("");
    setQuantity("");
    setPrice("");
    setError(null);
  };

  const onCloseAndClear = () => {
    clearForm();
    handleClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validação básica de segurança antes de disparar a API
    const parsedQuantity = Number(quantity);
    const parsedPrice = Number(price);

    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      setError("A quantidade deve ser um número maior que zero.");
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError("O preço médio não pode ser negativo.");
      return;
    }

    setLoading(true);

    const payload = {
      ticker: ticker.toUpperCase().trim(),
      quantity: parsedQuantity,
      average_price: parsedPrice,
    };

    try {
      await request("/assets", "POST", payload);
      onSuccess();
      onCloseAndClear();
    } catch (err) {
      setError((err as Error).message || "Não foi possível adicionar o ativo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onCloseAndClear} centered contentClassName="border-0 rounded-3 text-white" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="p-4 rounded-3" style={{ backgroundColor: "#121212", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
        
        <Modal.Header className="border-0 p-0 mb-4 d-flex justify-content-between align-items-center">
          <div>
            <Modal.Title className="fw-bold h5 m-0 tracking-tight">Adicionar Ativo</Modal.Title>
            <p className="text-white-50 small m-0 mt-1">Insira os detalhes da nova operação</p>
          </div>
          <button type="button" className="btn-close btn-close-white shadow-none" onClick={onCloseAndClear} aria-label="Close" />
        </Modal.Header>

        <Modal.Body className="p-0">
          {error && (
            <Alert variant="dark" className="border-danger text-danger bg-transparent small mb-4 py-2 text-center">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="assetTicker">
              <Form.Label className="text-white-50 small d-flex align-items-center gap-2 mb-1">
                <Layers size={14} /> Código do Ativo (Ticker)
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: PETR4, IVVB11, BTC"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                required
                disabled={loading}
                className="text-white border-secondary border-opacity-25 py-2 px-3 shadow-none text-uppercase"
                style={{ fontSize: "14px", backgroundColor: "#1A1A1A" }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="assetQuantity">
              <Form.Label className="text-white-50 small d-flex align-items-center gap-2 mb-1">
                <Hash size={14} /> Quantidade
              </Form.Label>
              <Form.Control
                type="number"
                step="any"
                placeholder="0.00"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                disabled={loading}
                className="text-white border-secondary border-opacity-25 py-2 px-3 shadow-none"
                style={{ fontSize: "14px", backgroundColor: "#1A1A1A" }}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="assetPrice">
              <Form.Label className="text-white-50 small d-flex align-items-center gap-2 mb-1">
                <DollarSign size={14} /> Preço Médio Pago (R$)
              </Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                disabled={loading}
                className="text-white border-secondary border-opacity-25 py-2 px-3 shadow-none"
                style={{ fontSize: "14px", backgroundColor: "#1A1A1A" }}
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                variant="dark"
                type="button"
                onClick={onCloseAndClear}
                disabled={loading}
                className="w-50 bg-transparent border-secondary border-opacity-25 text-white-50 rounded-2 py-2 fw-medium"
                style={{ fontSize: "14px" }}
              >
                Cancelar
              </Button>
              <Button
                variant="white"
                type="submit"
                disabled={loading}
                className="w-50 bg-white text-black border-0 rounded-2 py-2 fw-semibold d-flex align-items-center justify-content-center"
                style={{ fontSize: "14px" }}
              >
                {loading ? <Spinner animation="border" size="sm" variant="dark" /> : "Salvar Ativo"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </div>
    </Modal>
  );
};