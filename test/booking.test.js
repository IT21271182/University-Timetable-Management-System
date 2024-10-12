const { mockRequest, mockResponse } = require('express-async-handler');
const {
  getAllBookings,
  bookRoom,
  deleteBooking
} = require('../controllers/bookingController');
const Booking = require('../models/bookingModel');
const ClassRoom = require('../models/classRoomModel');

describe('Booking Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock calls before each test
  });

  it('should get all bookings', async () => {
    const bookingsMockData = [{ /* Mock booking data */ }];
    Booking.find = jest.fn().mockResolvedValue(bookingsMockData);
    const req = mockRequest();
    const res = mockResponse();

    await getAllBookings(req, res);

    expect(Booking.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(bookingsMockData);
  });

  it('should book a room', async () => {
    // Mock request body
    const requestBody = {
      roomId: 'roomId',
      startTime: new Date(),
      endTime: new Date(),
      courseId: 'courseId'
    };
    // Mock room data
    const roomMockData = { /* Mock room data */ };
    ClassRoom.findById = jest.fn().mockResolvedValue(roomMockData);
    // Mock booking creation
    Booking.create = jest.fn().mockResolvedValue({ _id: 'bookingId' });
    const req = mockRequest({ body: requestBody });
    const res = mockResponse();

    await bookRoom(req, res);

    expect(ClassRoom.findById).toHaveBeenCalledWith(requestBody.roomId);
    expect(Booking.create).toHaveBeenCalledWith({
      room: requestBody.roomId,
      startTime: requestBody.startTime,
      endTime: requestBody.endTime,
      course: requestBody.courseId
    });
    expect(roomMockData.bookings).toContain('bookingId');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Booking created successfully', booking: { _id: 'bookingId' } });
  });

  it('should delete a booking', async () => {
    const bookingId = 'bookingId';
    const bookingMockData = { /* Mock booking data */ };
    const roomMockData = { /* Mock room data */ };
    Booking.findByIdAndDelete = jest.fn().mockResolvedValue(bookingMockData);
    ClassRoom.findById = jest.fn().mockResolvedValue(roomMockData);
    const req = mockRequest({ params: { id: bookingId } });
    const res = mockResponse();

    await deleteBooking(req, res);

    expect(Booking.findByIdAndDelete).toHaveBeenCalledWith(bookingId);
    expect(ClassRoom.findById).toHaveBeenCalledWith(bookingMockData.room);
    expect(roomMockData.bookings).not.toContain(bookingId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Booking deleted successfully' });
  });
});
