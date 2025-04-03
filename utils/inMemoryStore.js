/**
 * In-memory data store to replace MongoDB
 */

// In-memory storage for bookings
const bookings = [];
let nextId = 1;

// Helper to generate unique IDs
const generateId = () => {
  const id = nextId.toString();
  nextId++;
  return id;
};

// Find booking by ID
const findById = (id) => {
  return bookings.find(booking => booking.id === id);
};

// Find bookings by query
const find = (query = {}) => {
  return bookings.filter(booking => {
    // Match all conditions in the query
    for (const [key, value] of Object.entries(query)) {
      if (key === '$or') {
        // Handle $or operator
        if (!value.some(condition => {
          for (const [condKey, condValue] of Object.entries(condition)) {
            if (typeof condValue === 'object') {
              // Handle operators like $gte, $lt
              for (const [op, opValue] of Object.entries(condValue)) {
                if (op === '$gte' && booking[condKey] < opValue) return false;
                if (op === '$gt' && booking[condKey] <= opValue) return false;
                if (op === '$lt' && booking[condKey] >= opValue) return false;
                if (op === '$lte' && booking[condKey] > opValue) return false;
              }
            } else if (booking[condKey] !== condValue) {
              return false;
            }
          }
          return true;
        })) {
          return false;
        }
      } else if (key === 'status' && value.$in) {
        // Handle $in operator for status
        if (!value.$in.includes(booking.status)) {
          return false;
        }
      } else if (booking[key] !== value) {
        return false;
      }
    }
    return true;
  });
};

// Find one booking by query
const findOne = (query = {}) => {
  return find(query)[0];
};

// Create a new booking
const create = (data) => {
  const booking = {
    ...data,
    id: generateId(),
    createdAt: new Date()
  };
  bookings.push(booking);
  return booking;
};

// Update a booking
const findByIdAndUpdate = (id, update) => {
  const index = bookings.findIndex(booking => booking.id === id);
  if (index === -1) return null;
  
  const updatedBooking = { ...bookings[index], ...update };
  bookings[index] = updatedBooking;
  return updatedBooking;
};

// Delete a booking
const findByIdAndDelete = (id) => {
  const index = bookings.findIndex(booking => booking.id === id);
  if (index === -1) return null;
  
  const deletedBooking = bookings[index];
  bookings.splice(index, 1);
  return deletedBooking;
};

// Sort results
const sort = (results, sortOptions) => {
  return [...results].sort((a, b) => {
    for (const [field, order] of Object.entries(sortOptions)) {
      if (a[field] < b[field]) return order === 1 ? -1 : 1;
      if (a[field] > b[field]) return order === 1 ? 1 : -1;
    }
    return 0;
  });
};

module.exports = {
  find,
  findOne,
  findById,
  create,
  findByIdAndUpdate,
  findByIdAndDelete,
  sort
};
