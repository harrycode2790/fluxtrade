import PaymentMethod from "../models/paymentMethod.model.js";

// --- Get all Payment Methods ---
export const getPaymentMethods = async (req, res) => {
  try {
    const methods = await PaymentMethod.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Payment methods retrieved.", methods });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};


// --- Create Payment Method ---
export const createPaymentMethod = async (req, res) => {
  try {
    const { name, icon, address, network, desc } = req.body;

    if (!name || !icon || !address || !network || !desc) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const method = await PaymentMethod.create({
      name,
      icon,
      address,
      network,
      desc,
    });

    res.status(201).json({ message: "Payment method created.", method });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// --- Update Payment Method ---
export const updatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await PaymentMethod.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Payment method not found." });
    }

    res.status(200).json({ message: "Payment method updated.", updated });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// --- Delete Payment Method ---
export const deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await PaymentMethod.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Payment method not found." });
    }

    res.status(200).json({ message: "Payment method deleted." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
