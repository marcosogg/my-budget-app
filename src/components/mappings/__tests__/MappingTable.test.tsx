import { render, screen, fireEvent } from '@testing-library/react';
import { MappingTable } from '../MappingTable';

const mockMappings = [
  {
    id: '1',
    description: 'Test Description',
    category_id: 'cat1',
    category_name: 'Test Category',
    transaction_count: 5,
    last_used_date: '2024-01-01T00:00:00Z'
  }
];

describe('MappingTable', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    render(
      <MappingTable
        mappings={[]}
        isLoading={true}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getAllByRole('row')).toHaveLength(6); // Header + 5 skeleton rows
  });

  it('renders error state correctly', () => {
    const error = new Error('Test error');
    render(
      <MappingTable
        mappings={[]}
        error={error}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText(/Test error/)).toBeInTheDocument();
  });

  it('renders empty state correctly', () => {
    render(
      <MappingTable
        mappings={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText('No mappings found')).toBeInTheDocument();
  });

  it('renders mappings correctly', () => {
    render(
      <MappingTable
        mappings={mockMappings}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('handles edit action correctly', () => {
    render(
      <MappingTable
        mappings={mockMappings}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    const editButton = screen.getAllByRole('button')[0];
    fireEvent.click(editButton);
    expect(mockOnEdit).toHaveBeenCalledWith(mockMappings[0]);
  });

  it('handles delete action correctly', () => {
    render(
      <MappingTable
        mappings={mockMappings}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    const deleteButton = screen.getAllByRole('button')[1];
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith(mockMappings[0].id);
  });

  it('formats dates correctly', () => {
    render(
      <MappingTable
        mappings={[{
          ...mockMappings[0],
          last_used_date: null
        }]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText('Never')).toBeInTheDocument();
  });
});