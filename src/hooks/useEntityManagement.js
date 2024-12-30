import { useState } from 'react';
import axios from 'axios';

const useEntityManagement = (baseUrl, token) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEntities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(baseUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const createEntity = async (entity) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(baseUrl, entity, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEntities();
    } catch (err) {
      setError(err.message || 'Failed to create entity');
    } finally {
      setLoading(false);
    }
  };

  const updateEntity = async (id, entity) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(`${baseUrl}/${id}`, entity, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEntities();
    } catch (err) {
      setError(err.message || 'Failed to update entity');
    } finally {
      setLoading(false);
    }
  };

  const deleteEntity = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${baseUrl}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEntities();
    } catch (err) {
      setError(err.message || 'Failed to delete entity');
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    fetchEntities,
    createEntity,
    updateEntity,
    deleteEntity,
  };
};

export default useEntityManagement;
